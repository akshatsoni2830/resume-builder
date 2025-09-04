import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, X, Info } from 'lucide-react';

const PDFUploader = ({ onPDFParsed }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseError, setParseError] = useState('');
  const [parseSuccess, setParseSuccess] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [parsingResults, setParsingResults] = useState({});
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    if (file.type !== 'application/pdf') {
      setParseError('Please upload a PDF file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setParseError('File size must be less than 10MB.');
      return;
    }

    // Check if file size is 0
    if (file.size === 0) {
      setParseError('The selected file appears to be empty. Please try a different file.');
      return;
    }


    setUploadedFile(file);
    setParseError('');
    setParseSuccess(false);
    setParsedData(null);
    setParsingResults({});
    await parsePDF(file);
  };

  const parsePDF = async (file) => {
    setIsUploading(true);
    setParseError('');

    try {
      // Extract text from PDF
      const extractedText = await extractPDFText(file);
      
      // Parse the extracted text into structured data
      const { parsedData: data, results } = parseExtractedText(extractedText);
      
      setParsedData(data);
      setParsingResults(results);
      
      // Pass the parsed data back to parent component
      onPDFParsed(data);
      
      setParseSuccess(true);
      console.log('PDF parsed successfully:', data);
      console.log('Parsing results:', results);
      
    } catch (error) {
      console.error('PDF parsing error:', error);
      setParseError(`Failed to parse PDF: ${error.message}. Please ensure the PDF contains selectable text and try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  // Extract text from PDF using FileReader and pdf-parse
  const extractPDFText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          
          // Import pdf-parse dynamically
          const pdfParse = await import('pdf-parse');
          
          // Parse the PDF
          const pdfData = await pdfParse.default(arrayBuffer);
          const extractedText = pdfData.text;
          
          console.log('Extracted PDF text:', extractedText);
          console.log('PDF metadata:', pdfData.info);
          console.log('Number of pages:', pdfData.numpages);
          
          // Check if text was extracted
          if (!extractedText || extractedText.trim().length === 0) {
            console.warn('No text extracted from PDF. This might be an image-based PDF.');
            // For now, we'll use a fallback - you can implement OCR here later
            resolve('No text content found in PDF. Please ensure the PDF contains selectable text.');
          } else {
            resolve(extractedText);
          }
        } catch (error) {
          console.error('PDF parsing error:', error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        reject(error);
      };
      
      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  };

  // Parse extracted text into structured resume data
  const parseExtractedText = (text) => {
    const parsedData = {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: '',
      education: [],
      experience: [],
      skills: {
        technical: '',
        soft: '',
        languages: ''
      },
      projects: [],
      certifications: []
    };

    const results = {
      success: [],
      warnings: [],
      errors: [],
      skipped: []
    };

    try {
      console.log('Parsing text:', text);
      
      // Check if this is a fallback message
      if (text.includes('No text content found in PDF')) {
        results.errors.push('PDF contains no extractable text. This might be an image-based PDF.');
        return { parsedData, results };
      }

      const lines = text.split('\n').filter(line => line.trim());

      // Extract name (usually first line or first non-empty line)
      if (lines.length > 0) {
        let name = '';
        // Try to find a name in the first few lines
        for (let i = 0; i < Math.min(3, lines.length); i++) {
          const line = lines[i].trim();
          // Look for lines that could be names (not emails, phones, or common resume headers)
          if (line && 
              !line.includes('@') && 
              !line.includes('+') && 
              !line.includes('Phone') && 
              !line.includes('Email') &&
              !line.includes('RESUME') &&
              !line.includes('CV') &&
              line.length > 2 && 
              line.length < 50) {
            name = line;
            break;
          }
        }
        
        if (name) {
          parsedData.fullName = name;
          results.success.push(`Name extracted: "${name}"`);
        } else {
          results.warnings.push('Name could not be extracted from first few lines');
        }
      }

      // Extract email
      const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch) {
        parsedData.email = emailMatch[0];
        results.success.push(`Email extracted: "${emailMatch[0]}"`);
      } else {
        results.warnings.push('Email address not found in the document');
      }

      // Extract phone with more flexible patterns
      const phonePatterns = [
        /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
        /(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})/,
        /\+?[1-9][\d\s\-()]{7,20}/
      ];

      let phoneFound = false;
      for (const pattern of phonePatterns) {
        const phoneMatch = text.match(pattern);
        if (phoneMatch) {
          parsedData.phone = phoneMatch[0];
          results.success.push(`Phone extracted: "${phoneMatch[0]}"`);
          phoneFound = true;
          break;
        }
      }

      if (!phoneFound) {
        results.warnings.push('Phone number not found or in unrecognized format');
      }

      // Extract location (look for city, state pattern)
      const locationMatch = text.match(/([A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+)*),\s*([A-Z]{2})/);
      if (locationMatch) {
        parsedData.location = locationMatch[0];
        results.success.push(`Location extracted: "${locationMatch[0]}"`);
      } else {
        results.warnings.push('Location not found in standard format');
      }

      // Extract LinkedIn
      const linkedinMatch = text.match(/linkedin\.com\/in\/[^\s]+/i);
      if (linkedinMatch) {
        parsedData.linkedin = `https://www.${linkedinMatch[0]}`;
        results.success.push(`LinkedIn profile extracted: "${linkedinMatch[0]}"`);
      } else {
        results.skipped.push('LinkedIn profile not found');
      }

      // Extract summary
      const summaryMatch = text.match(/PROFESSIONAL SUMMARY\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (summaryMatch) {
        const summary = summaryMatch[1].trim();
        if (summary.length > 20) {
          parsedData.summary = summary;
          results.success.push(`Professional summary extracted (${summary.length} characters)`);
        } else {
          results.warnings.push('Professional summary found but too short');
        }
      } else {
        results.warnings.push('Professional summary section not found');
      }

      // Extract experience
      const experienceMatch = text.match(/EXPERIENCE\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (experienceMatch) {
        const expText = experienceMatch[1];
        const expBlocks = expText.split(/(?=\n[A-Z][^a-z]*[a-z][^:]*:)/).filter(block => block.trim());
        
        parsedData.experience = expBlocks.map((block, index) => {
          const lines = block.trim().split('\n').filter(line => line.trim());
          const firstLine = lines[0] || '';
          
          const companyPositionMatch = firstLine.match(/^([^-]+)\s*-\s*(.+)$/);
          const company = companyPositionMatch ? companyPositionMatch[1].trim() : `Company ${index + 1}`;
          const position = companyPositionMatch ? companyPositionMatch[2].trim() : 'Position';
          
          const secondLine = lines[1] || '';
          const dateMatch = secondLine.match(/([A-Za-z]+\s+\d{4})\s*-\s*([A-Za-z]+\s+\d{4}|Present|Current)/i);
          
          let startDate = '';
          let endDate = '';
          let current = false;
          
          if (dateMatch) {
            startDate = dateMatch[1].trim();
            endDate = dateMatch[2].trim();
            current = endDate.toLowerCase().includes('present') || endDate.toLowerCase().includes('current');
          }
          
          const description = lines.slice(2).join('\n').trim();
          
          return {
            company,
            position,
            startDate,
            endDate,
            current,
            description
          };
        });

        if (parsedData.experience.length > 0) {
          results.success.push(`${parsedData.experience.length} work experience entries extracted`);
        } else {
          results.warnings.push('Work experience section found but no entries could be parsed');
        }
      } else {
        results.warnings.push('Work experience section not found');
      }

      // Extract education
      const educationMatch = text.match(/EDUCATION\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (educationMatch) {
        const eduText = educationMatch[1];
        const eduBlocks = eduText.split(/(?=\n[A-Z][^a-z]*[a-z][^:]*:)/).filter(block => block.trim());
        
        parsedData.education = eduBlocks.map((block, index) => {
          const lines = block.trim().split('\n').filter(line => line.trim());
          const firstLine = lines[0] || '';
          
          const degreeFieldMatch = firstLine.match(/^([^-]+)\s*-\s*([^-]+)$/);
          let degree = '';
          let field = '';
          
          if (degreeFieldMatch) {
            degree = degreeFieldMatch[1].trim();
            field = degreeFieldMatch[2].trim();
          } else {
            degree = firstLine.trim();
          }
          
          const secondLine = lines[1] || '';
          const institutionDateMatch = secondLine.match(/^([^-]+)\s*-\s*(.+)$/);
          const institution = institutionDateMatch ? institutionDateMatch[1].trim() : secondLine.trim();
          const graduationDate = institutionDateMatch ? institutionDateMatch[2].trim() : '';
          
          const additionalInfo = lines.slice(2).join('\n').trim();
          
          return {
            institution,
            degree,
            field,
            graduationDate,
            gpa: '',
            achievements: additionalInfo
          };
        });

        if (parsedData.education.length > 0) {
          results.success.push(`${parsedData.education.length} education entries extracted`);
        } else {
          results.warnings.push('Education section found but no entries could be parsed');
        }
      } else {
        results.warnings.push('Education section not found');
      }

      // Extract skills
      const skillsMatch = text.match(/SKILLS\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (skillsMatch) {
        const skillsText = skillsMatch[1];
        
        const technicalMatch = skillsText.match(/Technical Skills:\s*([^\n]+)/i);
        if (technicalMatch) {
          parsedData.skills.technical = technicalMatch[1].trim();
          results.success.push('Technical skills extracted');
        }
        
        const softMatch = skillsText.match(/Soft Skills:\s*([^\n]+)/i);
        if (softMatch) {
          parsedData.skills.soft = softMatch[1].trim();
          results.success.push('Soft skills extracted');
        }
        
        const languagesMatch = skillsText.match(/Languages:\s*([^\n]+)/i);
        if (languagesMatch) {
          parsedData.skills.languages = languagesMatch[1].trim();
          results.success.push('Languages extracted');
        }

        if (!parsedData.skills.technical && !parsedData.skills.soft) {
          results.warnings.push('Skills section found but no specific skills could be parsed');
        }
      } else {
        results.warnings.push('Skills section not found');
      }

      // Extract projects
      const projectsMatch = text.match(/PROJECTS\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (projectsMatch) {
        const projectsText = projectsMatch[1];
        const projectBlocks = projectsText.split(/(?=\n[A-Z][^a-z]*[a-z][^:]*:)/).filter(block => block.trim());
        
        parsedData.projects = projectBlocks.map((block, index) => {
          const lines = block.trim().split('\n').filter(line => line.trim());
          const firstLine = lines[0] || '';
          
          let technologies = '';
          let link = '';
          let description = '';
          
          lines.slice(1).forEach(line => {
            if (line.toLowerCase().includes('technologies:')) {
              technologies = line.split(':')[1]?.trim() || '';
            } else if (line.toLowerCase().includes('link:')) {
              link = line.split(':')[1]?.trim() || '';
            } else if (line.toLowerCase().includes('description:')) {
              description = line.split(':')[1]?.trim() || '';
            } else if (!technologies && !link && !description) {
              description = line.trim();
            }
          });
          
          return {
            name: firstLine.trim(),
            description: description || lines.slice(1).join('\n').trim(),
            technologies,
            link
          };
        });

        if (parsedData.projects.length > 0) {
          results.success.push(`${parsedData.projects.length} project entries extracted`);
        } else {
          results.warnings.push('Projects section found but no entries could be parsed');
        }
      } else {
        results.skipped.push('Projects section not found');
      }

      // Extract certifications
      const certMatch = text.match(/CERTIFICATIONS\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (certMatch) {
        const certText = certMatch[1];
        const certLines = certText.split('\n').filter(line => line.trim());
        const certifications = [];
        let currentCert = null;
        
        certLines.forEach((line) => {
          const trimmedLine = line.trim();
          
          if (trimmedLine.includes('—')) {
            if (currentCert && currentCert.name) {
              certifications.push(currentCert);
            }
            
            currentCert = { name: '', issuer: '', date: '', link: '' };
            const parts = trimmedLine.split('—');
            if (parts.length >= 2) {
              currentCert.name = parts[0].trim();
              currentCert.issuer = parts[1].trim();
            } else {
              currentCert.name = trimmedLine;
            }
          } else if (currentCert) {
            if (trimmedLine.match(/^\d{4}/)) {
              const yearMatch = trimmedLine.match(/(\d{4})/);
              if (yearMatch) {
                currentCert.date = yearMatch[1];
              }
              
              const linkMatch = trimmedLine.match(/(https?:\/\/[^\s]+)/);
              if (linkMatch) {
                currentCert.link = linkMatch[1];
              }
            } else if (trimmedLine.includes('http')) {
              currentCert.link = trimmedLine;
            }
          }
        });
        
        if (currentCert && currentCert.name) {
          certifications.push(currentCert);
        }
        
        parsedData.certifications = certifications;

        if (certifications.length > 0) {
          results.success.push(`${certifications.length} certification entries extracted`);
        } else {
          results.warnings.push('Certifications section found but no entries could be parsed');
        }
      } else {
        results.skipped.push('Certifications section not found');
      }

      // Clean up empty arrays and objects
      if (parsedData.experience.length === 0) delete parsedData.experience;
      if (parsedData.education.length === 0) delete parsedData.education;
      if (parsedData.certifications.length === 0) delete parsedData.certifications;
      if (parsedData.projects.length === 0) delete parsedData.projects;

    } catch (error) {
      console.error('Text parsing error:', error);
      results.errors.push('Failed to parse extracted text: ' + error.message);
      throw new Error('Failed to parse extracted text');
    }

    return { parsedData, results };
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setParseError('');
    setParseSuccess(false);
    setParsedData(null);
    setParsingResults({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      console.log('File dropped:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      if (file.type === 'application/pdf') {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setParseError('File size must be less than 10MB.');
          return;
        }

        // Check if file size is 0
        if (file.size === 0) {
          setParseError('The selected file appears to be empty. Please try a different file.');
          return;
        }

        setUploadedFile(file);
        setParseError('');
        setParseSuccess(false);
        setParsedData(null);
        setParsingResults({});
        parsePDF(file);
      } else {
        setParseError('Please drop a PDF file.');
      }
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'skipped':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Upload Existing Resume (PDF)
        </h2>
        <div className="flex items-center space-x-2 ml-4">
          <Upload className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">PDF Parser</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            uploadedFile
              ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!uploadedFile ? (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Drop your PDF resume here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to browse files
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Choose PDF File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {uploadedFile.size > 0 ? 
                    `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : 
                    'File size unknown'
                  }
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Type: {uploadedFile.type || 'application/pdf'}
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Remove File</span>
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Processing PDF...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Extracting text and parsing resume data
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {parseSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  PDF Parsed Successfully!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Resume data has been extracted and filled into the form
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Parsing Results */}
        {parseSuccess && parsedData && Object.keys(parsingResults).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
              📊 Parsing Results
            </h3>
            
            {Object.entries(parsingResults).map(([type, messages]) => {
              if (messages.length === 0) return null;
              
              return (
                <div key={type} className="mb-3">
                  <h4 className={`text-xs font-medium mb-2 capitalize ${getResultColor(type)}`}>
                    {type} ({messages.length})
                  </h4>
                  <ul className="space-y-1">
                    {messages.map((message, index) => (
                      <li key={index} className="flex items-start space-x-2 text-xs">
                        {getResultIcon(type)}
                        <span className={getResultColor(type)}>{message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 <strong>Note:</strong> Some data may not appear if it doesn't match the expected format. 
                You can manually edit any fields after the data is imported.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {parseError && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Upload Error
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {parseError}
                </p>
                {parseError.includes('empty') && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    💡 Try selecting the file again or use a different PDF file.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            💡 How it works
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Upload your existing PDF resume</li>
            <li>• AI extracts text and parses it into structured fields</li>
            <li>• Form is automatically filled with extracted data</li>
            <li>• Edit and enhance the parsed content as needed</li>
            <li>• <strong>Note:</strong> Works with text-based PDFs (not image-based)</li>
            <li>• Shows detailed parsing results and any issues found</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>⚠️ Important:</strong> The PDF must contain selectable text. Scanned images or image-based PDFs won't work. 
              Try copying text from your PDF to verify it's text-based.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;
