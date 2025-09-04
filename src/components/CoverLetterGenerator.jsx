import React, { useState, useEffect } from 'react';
import { FileText, Edit3, Download, Copy, CheckCircle, Loader, Sparkles } from 'lucide-react';

const CoverLetterGenerator = ({ resumeData, jobDescription, isVisible = true }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (coverLetter && !isEditing) {
      setEditedContent(coverLetter);
    }
  }, [coverLetter, isEditing]);

  if (!isVisible) return null;

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const generated = await simulateCoverLetterGeneration();
      setCoverLetter(generated);
      setEditedContent(generated);
      setIsEditing(false);
    } catch (error) {
      console.error('Cover letter generation error:', error);
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateCoverLetterGeneration = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const letter = createCoverLetter();
        resolve(letter);
      }, 3000);
    });
  };

  const createCoverLetter = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const companyName = extractCompanyName(jobDescription) || 'the company';
    const position = extractPosition(jobDescription) || 'the position';
    const skills = extractRelevantSkills(jobDescription, resumeData);

    let letter = `${today}\n\n`;

    // Recipient (if company name is found)
    if (companyName !== 'the company') {
      letter += `Dear Hiring Manager at ${companyName},\n\n`;
    } else {
      letter += `Dear Hiring Manager,\n\n`;
    }

    // Opening paragraph
    letter += `I am writing to express my strong interest in ${position} at ${companyName}. `;
    
    if (resumeData.summary) {
      letter += resumeData.summary;
    } else {
      letter += `As a passionate and experienced professional, I am excited about the opportunity to contribute to your team and help drive success in this role.`;
    }

    letter += `\n\n`;

    // Experience paragraph
    if (resumeData.experience && resumeData.experience.length > 0) {
      const latestExp = resumeData.experience[0];
      letter += `In my current role as ${latestExp.position} at ${latestExp.company}, I have `;
      
      if (latestExp.description) {
        // Extract key achievements from description
        const achievements = extractAchievements(latestExp.description);
        if (achievements.length > 0) {
          letter += achievements.slice(0, 2).join(' and ');
        } else {
          letter += `gained valuable experience in ${skills.join(', ')}`;
        }
      } else {
        letter += `gained valuable experience in ${skills.join(', ')}`;
      }
      
      letter += `. This experience has equipped me with the skills and knowledge necessary to excel in ${position}.\n\n`;
    }

    // Skills paragraph
    if (resumeData.skills && resumeData.skills.technical) {
      letter += `My technical expertise includes ${resumeData.skills.technical}. `;
    }
    
    if (resumeData.skills && resumeData.skills.soft) {
      letter += `Additionally, I bring strong ${resumeData.skills.soft} skills that enable me to work effectively in collaborative environments and deliver results under pressure.\n\n`;
    } else {
      letter += `Additionally, I bring strong problem-solving and communication skills that enable me to work effectively in collaborative environments and deliver results under pressure.\n\n`;
    }

    // Projects paragraph (if available)
    if (resumeData.projects && resumeData.projects.length > 0) {
      const relevantProject = resumeData.projects.find(p => 
        p.technologies && skills.some(skill => 
          p.technologies.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      if (relevantProject) {
        letter += `I recently completed a project called "${relevantProject.name}" where I `;
        if (relevantProject.description) {
          letter += relevantProject.description;
        } else {
          letter += `utilized ${relevantProject.technologies || 'relevant technologies'} to deliver a successful solution`;
        }
        letter += `. This project demonstrates my ability to apply technical skills to real-world challenges.\n\n`;
      }
    }

    // Education paragraph (if relevant)
    if (resumeData.education && resumeData.education.length > 0) {
      const latestEdu = resumeData.education[0];
      letter += `I hold a ${latestEdu.degree} in ${latestEdu.field} from ${latestEdu.institution}. `;
      
      if (latestEdu.achievements) {
        letter += `During my studies, I ${latestEdu.achievements.toLowerCase()}. `;
      }
      
      letter += `My educational background has provided me with a solid foundation in ${skills.slice(0, 3).join(', ')} and prepared me for the challenges of this role.\n\n`;
    }

    // Closing paragraph
    letter += `I am particularly drawn to ${companyName} because of its reputation for innovation and excellence. `;
    letter += `I am confident that my combination of technical skills, relevant experience, and passion for ${position} makes me an ideal candidate for this opportunity.\n\n`;
    
    letter += `I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. `;
    letter += `Thank you for considering my application. I look forward to hearing from you.\n\n`;
    
    letter += `Sincerely,\n`;
    letter += `${resumeData.fullName || 'Your Name'}`;

    return letter;
  };

  const extractCompanyName = (jd) => {
    if (!jd) return null;
    
    // Common patterns for company names
    const patterns = [
      /(?:at|with|for)\s+([A-Z][a-zA-Z\s&.,]+?)(?:\s+is|,|\n|\.)/i,
      /([A-Z][a-zA-Z\s&.,]+?)\s+is\s+(?:looking|seeking|hiring)/i,
      /(?:join|work\s+at)\s+([A-Z][a-zA-Z\s&.,]+?)(?:\s+as|,|\n|\.)/i
    ];

    for (const pattern of patterns) {
      const match = jd.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  };

  const extractPosition = (jd) => {
    if (!jd) return null;
    
    const patterns = [
      /(?:seeking|looking\s+for|hiring)\s+(?:a|an)?\s*([A-Z][a-zA-Z\s]+?)(?:developer|engineer|specialist|manager|analyst)/i,
      /(?:position|role):\s*([A-Z][a-zA-Z\s]+?)(?:developer|engineer|specialist|manager|analyst)/i,
      /(?:join\s+us\s+as|work\s+as)\s+(?:a|an)?\s*([A-Z][a-zA-Z\s]+?)(?:developer|engineer|specialist|manager|analyst)/i
    ];

    for (const pattern of patterns) {
      const match = jd.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  };

  const extractRelevantSkills = (jd, resume) => {
    if (!jd || !resume) return ['problem-solving', 'collaboration', 'technical skills'];
    
    const resumeSkills = [];
    
    // Extract skills from resume
    if (resume.skills && resume.skills.technical) {
      resumeSkills.push(...resume.skills.technical.split(',').map(s => s.trim()));
    }
    
    // Find matching skills between JD and resume
    const commonSkills = resumeSkills.filter(skill => 
      jd.toLowerCase().includes(skill.toLowerCase())
    );
    
    return commonSkills.length > 0 ? commonSkills : ['problem-solving', 'collaboration', 'technical skills'];
  };

  const extractAchievements = (description) => {
    if (!description) return [];
    
    const achievements = [];
    const lines = description.split('\n');
    
    lines.forEach(line => {
      if (line.includes('%') || line.includes('improved') || line.includes('increased') || 
          line.includes('reduced') || line.includes('led') || line.includes('managed')) {
        achievements.push(line.trim());
      }
    });
    
    return achievements;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setCoverLetter(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(coverLetter);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const exportToPDF = () => {
    // Create a simple text-based PDF export
    const element = document.createElement('div');
    element.innerHTML = coverLetter.replace(/\n/g, '<br>');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Cover Letter - ${resumeData.fullName || 'Your Name'}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { white-space: pre-line; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <div class="content">${coverLetter}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Cover Letter Generator
        </h2>
        <div className="flex items-center space-x-2 ml-4">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">AI-Powered</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Generate Button */}
        {!coverLetter && (
          <div className="text-center">
            <button
              onClick={generateCoverLetter}
              disabled={isGenerating}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Cover Letter</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Uses your resume data and job description to create a personalized cover letter
            </p>
          </div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Generating Your Cover Letter...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Analyzing resume data and creating personalized content
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cover Letter Display */}
        {coverLetter && !isGenerating && (
          <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Generated Cover Letter
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={exportToPDF}
                  className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="input-field min-h-[400px] resize-y font-mono text-sm"
                  placeholder="Edit your cover letter here..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="whitespace-pre-line font-mono text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {coverLetter}
                </div>
              </div>
            )}

            {/* Regenerate Option */}
            <div className="text-center">
              <button
                onClick={generateCoverLetter}
                className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Regenerate Cover Letter</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-sm">!</span>
              </div>
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            💡 How It Works
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Analyzes your resume data and job description</li>
            <li>• Generates personalized, professional cover letter</li>
            <li>• Highlights relevant skills and experience</li>
            <li>• Fully editable before export</li>
            <li>• ATS-friendly formatting and content</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
