import React, { useState } from 'react';
import { FileText, Sparkles, AlertCircle, Zap } from 'lucide-react';
import enhanceResume, { getEnhancementSuggestions } from '../utils/resumeEnhancer';

const PromptInputSection = ({ onParseData }) => {
  const [promptText, setPromptText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [enableEnhancement, setEnableEnhancement] = useState(true);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState([]);

  // Parse the prompt text into structured resume data
  const parsePromptText = async () => {
    if (!promptText.trim()) {
      setParseError('Please enter some text to parse.');
      return;
    }

    setIsParsing(true);
    setParseError('');

    try {
      // Initialize parsed data structure
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

      // Extract name (look for "Name:" pattern)
      const nameMatch = promptText.match(/Name:\s*([^\n]+)/i);
      if (nameMatch) {
        parsedData.fullName = nameMatch[1].trim();
      }

      // Extract email (look for "Email:" pattern or email format)
      const emailMatch = promptText.match(/Email:\s*([^\n]+)/i) || 
                        promptText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch) {
        parsedData.email = emailMatch[1] ? emailMatch[1].trim() : emailMatch[0];
      }

      // Extract phone (look for "Phone:" pattern or phone format)
      const phoneMatch = promptText.match(/Phone:\s*([^\n]+)/i) || 
                        promptText.match(/(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
      if (phoneMatch) {
        if (phoneMatch[1] && phoneMatch[2] && phoneMatch[3]) {
          parsedData.phone = `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}`;
        } else {
          parsedData.phone = phoneMatch[1] ? phoneMatch[1].trim() : phoneMatch[0];
        }
      }

      // Extract location (look for "Location:" pattern)
      const locationMatch = promptText.match(/Location:\s*([^\n]+)/i);
      if (locationMatch) {
        parsedData.location = locationMatch[1].trim();
      }

      // Extract LinkedIn (look for "LinkedIn:" pattern)
      const linkedinMatch = promptText.match(/LinkedIn:\s*([^\n]+)/i);
      if (linkedinMatch) {
        parsedData.linkedin = linkedinMatch[1].trim();
      }

      // Extract Website (look for "Website:" pattern)
      const websiteMatch = promptText.match(/Website:\s*([^\n]+)/i);
      if (websiteMatch) {
        parsedData.website = websiteMatch[1].trim();
      }

      // Extract summary (look for SUMMARY section)
      const summaryMatch = promptText.match(/PROFESSIONAL SUMMARY\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (summaryMatch) {
        parsedData.summary = summaryMatch[1].trim();
      }

      // Extract experience (look for EXPERIENCE section)
      const experienceMatch = promptText.match(/EXPERIENCE\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (experienceMatch) {
        const expText = experienceMatch[1];
        // Split by company/position patterns - improved pattern matching
        const expBlocks = expText.split(/(?=\n[A-Z][^a-z]*[a-z][^:]*:)/).filter(block => block.trim());
        
        parsedData.experience = expBlocks.map((block, index) => {
          const lines = block.trim().split('\n').filter(line => line.trim());
          const firstLine = lines[0] || '';
          
          // Extract company and position from first line
          const companyPositionMatch = firstLine.match(/^([^-]+)\s*-\s*(.+)$/);
          const company = companyPositionMatch ? companyPositionMatch[1].trim() : `Company ${index + 1}`;
          const position = companyPositionMatch ? companyPositionMatch[2].trim() : 'Position';
          
          // Extract dates from second line if available - improved date parsing
          const secondLine = lines[1] || '';
          const dateMatch = secondLine.match(/([A-Za-z]+\s+\d{4})\s*-\s*([A-Za-z]+\s+\d{4}|Ongoing|Present|Current)/i) ||
                           secondLine.match(/(\d{4})\s*-\s*(\d{4}|Ongoing|Present|Current)/i) ||
                           secondLine.match(/([A-Za-z]+\s+\d{4})\s*\(([^)]+)\)/i);
          
          let startDate = '';
          let endDate = '';
          let current = false;
          
          if (dateMatch) {
            if (dateMatch[1] && dateMatch[2]) {
              startDate = dateMatch[1].trim();
              endDate = dateMatch[2].trim();
              current = endDate.toLowerCase().includes('ongoing') || 
                       endDate.toLowerCase().includes('present') || 
                       endDate.toLowerCase().includes('current');
            }
          }
          
          // Extract description from remaining lines
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
      }

      // Extract education (look for EDUCATION section)
      const educationMatch = promptText.match(/EDUCATION\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (educationMatch) {
        const eduText = educationMatch[1];
        const eduBlocks = eduText.split(/(?=\n[A-Z][^a-z]*[a-z][^:]*:)/).filter(block => block.trim());
        
        parsedData.education = eduBlocks.map((block, index) => {
          const lines = block.trim().split('\n').filter(line => line.trim());
          const firstLine = lines[0] || '';
          const secondLine = lines[1] || '';
          
          // Extract degree and field from first line - improved pattern matching
          const degreeFieldMatch = firstLine.match(/^([^-]+)\s*-\s*([^-]+)$/);
          let degree = '';
          let field = '';
          
          if (degreeFieldMatch) {
            degree = degreeFieldMatch[1].trim();
            field = degreeFieldMatch[2].trim();
          } else {
            // Try to extract from the line itself
            const degreeMatch = firstLine.match(/(Bachelor|Master|Diploma|PhD|B\.Tech|M\.Tech|BSc|MSc|BA|MA)\s+(?:of|in)?\s*(.+)/i);
            if (degreeMatch) {
              degree = degreeMatch[1].trim();
              field = degreeMatch[2].trim();
            } else {
              degree = firstLine.trim();
            }
          }
          
          // Extract institution and dates from second line
          const institutionDateMatch = secondLine.match(/^([^-]+)\s*-\s*(.+)$/);
          const institution = institutionDateMatch ? institutionDateMatch[1].trim() : secondLine.trim();
          const graduationDate = institutionDateMatch ? institutionDateMatch[2].trim() : '';
          
          // Extract additional info from remaining lines
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
      }

      // Extract skills (look for SKILLS section)
      const skillsMatch = promptText.match(/SKILLS\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (skillsMatch) {
        const skillsText = skillsMatch[1];
        
        // Extract technical skills
        const technicalMatch = skillsText.match(/Technical Skills:\s*([^\n]+)/i);
        if (technicalMatch) {
          parsedData.skills.technical = technicalMatch[1].trim();
        }
        
        // Extract soft skills
        const softMatch = skillsText.match(/Soft Skills:\s*([^\n]+)/i);
        if (softMatch) {
          parsedData.skills.soft = softMatch[1].trim();
        }
        
        // Extract languages
        const languagesMatch = skillsText.match(/Languages:\s*([^\n]+)/i);
        if (languagesMatch) {
          parsedData.skills.languages = languagesMatch[1].trim();
        }
      }

      // Extract projects (look for PROJECTS section)
      const projectsMatch = promptText.match(/PROJECTS\s*\n([^]*?)(?=\n\s*[A-Z]|$)/i);
      if (projectsMatch) {
        const projectsText = projectsMatch[1];
        const projectBlocks = projectsText.split(/(?=\n[A-Z][^a-z]*[a-z][^:]*:)/).filter(block => block.trim());
        
        parsedData.projects = projectBlocks.map((block, index) => {
          const lines = block.trim().split('\n').filter(line => line.trim());
          const firstLine = lines[0] || '';
          
          // Extract technologies and link from subsequent lines
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
              // If no specific labels, assume it's description
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
      }

      // Extract certifications (look for CERTIFICATIONS section) - FIXED
      const certMatch = promptText.match(/CERTIFICATIONS\s*\n([^]*?)(?=\n\s*[A-Z][A-Z\s]*:|$)/i);
      if (certMatch) {
        const certText = certMatch[1];
        // Split by individual certification entries - improved splitting
        const certLines = certText.split('\n').filter(line => line.trim());
        const certifications = [];
        let currentCert = null;
        
        certLines.forEach((line, index) => {
          const trimmedLine = line.trim();
          
          // Check if this line starts a new certification (contains "—" separator)
          if (trimmedLine.includes('—')) {
            // Save previous certification if exists
            if (currentCert && currentCert.name) {
              certifications.push(currentCert);
            }
            
            // Start new certification
            currentCert = { name: '', issuer: '', date: '', link: '' };
            
            // Extract name and issuer from line with "—"
            const parts = trimmedLine.split('—');
            if (parts.length >= 2) {
              currentCert.name = parts[0].trim();
              currentCert.issuer = parts[1].trim();
            } else {
              currentCert.name = trimmedLine;
            }
          } else if (currentCert) {
            // This line contains additional info for current certification
            if (trimmedLine.match(/^\d{4}/)) {
              // Extract year
              const yearMatch = trimmedLine.match(/(\d{4})/);
              if (yearMatch) {
                currentCert.date = yearMatch[1];
              }
              
              // Extract link if present
              const linkMatch = trimmedLine.match(/(https?:\/\/[^\s]+)/);
              if (linkMatch) {
                currentCert.link = linkMatch[1];
              }
            } else if (trimmedLine.includes('http')) {
              // Extract link
              currentCert.link = trimmedLine;
            } else if (!currentCert.issuer && !trimmedLine.match(/^\d{4}/)) {
              // This might be additional issuer info
              currentCert.issuer = trimmedLine;
            }
          }
        });
        
        // Add the last certification
        if (currentCert && currentCert.name) {
          certifications.push(currentCert);
        }
        
        parsedData.certifications = certifications;
      }

      // Apply smart enhancement if enabled
      let finalData = parsedData;
      if (enableEnhancement) {
        finalData = enhanceResume(parsedData, promptText, true);
        console.log('Resume enhanced with ATS keywords and strong action verbs');
      }

      // Get enhancement suggestions
      const suggestions = getEnhancementSuggestions(promptText);
      setEnhancementSuggestions(suggestions);

      // Pass the parsed data back to the parent component
      onParseData(finalData);
      
      // Show success message
      setParseError('');
      
      console.log('Parsed data:', finalData);
      
    } catch (error) {
      setParseError('Error parsing text. Please check the format and try again.');
      console.error('Parse error:', error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleClear = () => {
    setPromptText('');
    setParseError('');
    setEnhancementSuggestions([]);
  };

  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Prompt-Based Input
        </h2>
        <div className="flex items-center space-x-2 ml-4">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Parsing</span>
        </div>
      </div>

      {/* Enhancement Toggle */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Smart Resume Enhancer
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Automatically enhance your resume with ATS keywords and strong action verbs
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableEnhancement}
              onChange={(e) => setEnableEnhancement(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {/* Example Template */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
            📋 Example Prompt Template
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <pre className="text-xs text-blue-700 dark:text-blue-300 whitespace-pre-wrap font-mono">
{`Name: [Your Full Name]
Email: [your.email@example.com]
Phone: [Your Phone Number]
Location: [City, Country]
LinkedIn: [linkedin.com/in/your-profile]
Website: [https://your-website.com]

PROFESSIONAL SUMMARY
[2-4 sentence summary about your skills and career goals]

EXPERIENCE
[Company Name] - [Job Title]
[Start Date] - [End Date]

[Key achievements with action verbs]

EDUCATION
[Degree, Institution, Year]

SKILLS
Technical: [Languages, Frameworks, Tools]
Soft Skills: [Leadership, Teamwork, Problem-Solving]
Languages: [English, Hindi, Gujarati]

PROJECTS
[Project Name]
Technologies: [Tech Stack Used]
Link: [Project URL]
Description: [What you built and achieved]

CERTIFICATIONS
[Certification Name] — [Issuing Organization]
[Date] [Verification Link]`}
            </pre>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            💡 Copy this template, replace the placeholders with your information, and paste below
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste Your Resume Text
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="input-field min-h-[200px] resize-y font-mono text-sm"
            placeholder="Paste your resume text here. The system will automatically parse and enhance your content with smart suggestions and ATS keywords."
          />
        </div>

        {parseError && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">{parseError}</span>
          </div>
        )}

        {/* Enhancement Suggestions */}
        {enhancementSuggestions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              💡 Enhancement Suggestions
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {enhancementSuggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            onClick={parsePromptText}
            disabled={isParsing || !promptText.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Parsing & Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Parse & Enhance Resume</span>
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="btn-secondary"
            disabled={!promptText.trim()}
          >
            Clear Text
          </button>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            🚀 Smart Enhancement Features
          </h3>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>• <strong>Action Verb Enhancement:</strong> Replaces weak verbs with strong, achievement-focused ones</li>
            <li>• <strong>ATS Keyword Injection:</strong> Automatically adds relevant industry keywords</li>
            <li>• <strong>Achievement Generation:</strong> Transforms vague descriptions into quantifiable achievements</li>
            <li>• <strong>Skill Enhancement:</strong> Adds missing technical and soft skills based on context</li>
            <li>• <strong>Professional Language:</strong> Converts casual language to professional terminology</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PromptInputSection;
