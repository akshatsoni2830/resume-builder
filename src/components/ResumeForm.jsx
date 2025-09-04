import React, { useState } from 'react';
import PersonalInfoSection from './form-sections/PersonalInfoSection';
import SummarySection from './form-sections/SummarySection';
import EducationSection from './form-sections/EducationSection';
import ExperienceSection from './form-sections/ExperienceSection';
import SkillsSection from './form-sections/SkillsSection';
import ProjectsSection from './form-sections/ProjectsSection';
import CertificationsSection from './form-sections/CertificationsSection';
import PromptInputSection from './PromptInputSection';
import InputModeToggle from './InputModeToggle';
import AISectionWriter from './AISectionWriter';

const ResumeForm = ({ resumeData, onUpdate }) => {
  const [inputMode, setInputMode] = useState('form');

  // Update specific section of resume data
  const updateSection = (section, value) => {
    onUpdate({
      ...resumeData,
      [section]: value
    });
  };

  // Update nested object properties
  const updateNestedSection = (section, key, value) => {
    onUpdate({
      ...resumeData,
      [section]: {
        ...resumeData[section],
        [key]: value
      }
    });
  };

  // Update array items
  const updateArraySection = (section, index, value) => {
    const newArray = [...resumeData[section]];
    newArray[index] = value;
    onUpdate({
      ...resumeData,
      [section]: newArray
    });
  };

  // Add new item to array
  const addArrayItem = (section, defaultItem) => {
    onUpdate({
      ...resumeData,
      [section]: [...resumeData[section], defaultItem]
    });
  };

  // Remove item from array
  const removeArrayItem = (section, index) => {
    const newArray = resumeData[section].filter((_, i) => i !== index);
    onUpdate({
      ...resumeData,
      [section]: newArray
    });
  };

  // Handle parsed data from prompt input
  const handleParsedData = (parsedData) => {
    onUpdate(parsedData);
    setInputMode('form'); // Switch back to form mode after parsing
  };

  return (
    <div className="space-y-8">
      {/* Input Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">Choose your preferred input method</p>
        </div>
        <InputModeToggle currentMode={inputMode} onModeChange={setInputMode} />
      </div>

      {/* Prompt Input Mode */}
      {inputMode === 'prompt' && (
        <PromptInputSection onParseData={handleParsedData} />
      )}

      {/* Form Input Mode */}
      {inputMode === 'form' && (
        <>
          <PersonalInfoSection 
            data={resumeData} 
            onUpdate={(newData) => onUpdate(newData)} 
          />
          
          <SummarySection 
            data={resumeData.summary} 
            onUpdate={(value) => updateSection('summary', value)} 
          />
          
          {/* AI Summary Writer */}
          <AISectionWriter
            section="summary"
            currentContent={resumeData.summary}
            onContentGenerated={(content) => updateSection('summary', content)}
            isVisible={true}
          />
          
          <EducationSection 
            data={resumeData.education} 
            onUpdate={(index, value) => updateArraySection('education', index, value)}
            onAdd={() => addArrayItem('education', {
              institution: '',
              degree: '',
              field: '',
              graduationDate: '',
              gpa: '',
              achievements: ''
            })}
            onRemove={(index) => removeArrayItem('education', index)}
          />
          
          <ExperienceSection 
            data={resumeData.experience} 
            onUpdate={(index, value) => updateArraySection('experience', index, value)}
            onAdd={() => addArrayItem('experience', {
              company: '',
              position: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            })}
            onRemove={(index) => removeArrayItem('experience', index)}
          />
          
          {/* AI Experience Writer */}
          <AISectionWriter
            section="experience"
            currentContent={resumeData.experience?.[0]?.description || ''}
            onContentGenerated={(content) => {
              if (resumeData.experience && resumeData.experience.length > 0) {
                const updatedExperience = [...resumeData.experience];
                updatedExperience[0] = { ...updatedExperience[0], description: content };
                onUpdate({ ...resumeData, experience: updatedExperience });
              }
            }}
            isVisible={true}
          />
          
          <SkillsSection 
            data={resumeData.skills} 
            onUpdate={(key, value) => updateNestedSection('skills', key, value)}
          />
          
          {/* AI Skills Writer */}
          <AISectionWriter
            section="skills"
            currentContent={`${resumeData.skills?.technical || ''} ${resumeData.skills?.soft || ''}`.trim()}
            onContentGenerated={(content) => {
              // Parse the generated content and split into technical/soft skills
              const lines = content.split('\n');
              let technical = '';
              let soft = '';
              
              lines.forEach(line => {
                if (line.toLowerCase().includes('technical:')) {
                  technical = line.split(':')[1]?.trim() || '';
                } else if (line.toLowerCase().includes('soft:')) {
                  soft = line.split(':')[1]?.trim() || '';
                }
              });
              
              onUpdate({
                ...resumeData,
                skills: {
                  ...resumeData.skills,
                  technical: technical || resumeData.skills?.technical || '',
                  soft: soft || resumeData.skills?.soft || ''
                }
              });
            }}
            isVisible={true}
          />
          
          <ProjectsSection 
            data={resumeData.projects} 
            onUpdate={(index, value) => updateArraySection('projects', index, value)}
            onAdd={() => addArrayItem('projects', {
              name: '',
              description: '',
              technologies: '',
              link: ''
            })}
            onRemove={(index) => removeArrayItem('projects', index)}
          />
          
          {/* AI Projects Writer */}
          <AISectionWriter
            section="projects"
            currentContent={resumeData.projects?.[0]?.description || ''}
            onContentGenerated={(content) => {
              if (resumeData.projects && resumeData.projects.length > 0) {
                const updatedProjects = [...resumeData.projects];
                updatedProjects[0] = { ...updatedProjects[0], description: content };
                onUpdate({ ...resumeData, projects: updatedProjects });
              }
            }}
            isVisible={true}
          />
          
          <CertificationsSection 
            data={resumeData.certifications} 
            onUpdate={(index, value) => updateArraySection('certifications', index, value)}
            onAdd={() => addArrayItem('certifications', {
              name: '',
              issuer: '',
              date: '',
              link: ''
            })}
            onRemove={(index) => removeArrayItem('certifications', index)}
          />
          
          {/* AI Certifications Writer */}
          <AISectionWriter
            section="certifications"
            currentContent={resumeData.certifications?.[0]?.name || ''}
            onContentGenerated={(content) => {
              if (resumeData.certifications && resumeData.certifications.length > 0) {
                const updatedCertifications = [...resumeData.certifications];
                updatedCertifications[0] = { ...updatedCertifications[0], name: content };
                onUpdate({ ...resumeData, certifications: updatedCertifications });
              }
            }}
            isVisible={true}
          />
        </>
      )}
    </div>
  );
};

export default ResumeForm;
