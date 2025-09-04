import React, { useState } from 'react';
import { Sparkles, Wand2, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const AISectionWriter = ({ section, currentContent, onContentGenerated, isVisible = true }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');

  if (!isVisible) return null;

  const sectionConfigs = {
    summary: {
      title: 'Professional Summary',
      placeholder: 'Write a compelling professional summary...',
      prompt: 'Write a professional summary for a resume that highlights key skills, experience, and career goals. Make it engaging and ATS-friendly.',
      maxLength: 500
    },
    experience: {
      title: 'Work Experience',
      placeholder: 'Describe your work experience and achievements...',
      prompt: 'Write compelling work experience descriptions with strong action verbs and quantifiable achievements. Make it ATS-friendly.',
      maxLength: 1000
    },
    skills: {
      title: 'Skills Section',
      placeholder: 'List your technical and soft skills...',
      prompt: 'Generate a comprehensive skills section with technical skills, soft skills, and programming languages. Make it relevant and ATS-friendly.',
      maxLength: 300
    },
    projects: {
      title: 'Projects',
      placeholder: 'Describe your projects and technologies used...',
      prompt: 'Write project descriptions highlighting technologies used, challenges overcome, and outcomes achieved. Make it engaging and ATS-friendly.',
      maxLength: 1000
    },
    education: {
      title: 'Education',
      placeholder: 'Describe your educational background...',
      prompt: 'Write an education section highlighting relevant coursework, achievements, and academic accomplishments. Make it professional and ATS-friendly.',
      maxLength: 500
    },
    certifications: {
      title: 'Certifications',
      placeholder: 'List your certifications and achievements...',
      prompt: 'Generate a certifications section highlighting relevant professional certifications, training, and achievements. Make it comprehensive and ATS-friendly.',
      maxLength: 500
    }
  };

  const config = sectionConfigs[section] || sectionConfigs.summary;

  const generateContent = async (enhance = false) => {
    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      // Simulate AI content generation
      const content = await simulateAIGeneration(config, currentContent, enhance);
      setGeneratedContent(content);
      
      // Auto-apply the generated content
      onContentGenerated(content);
      
    } catch (error) {
      console.error('AI generation error:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateAIGeneration = async (config, currentContent, enhance) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let content = '';

        if (enhance && currentContent) {
          // Enhance existing content
          content = enhanceExistingContent(currentContent, config);
        } else {
          // Generate new content
          content = generateNewContent(config);
        }

        resolve(content);
      }, 2000);
    });
  };

  const enhanceExistingContent = (existingContent, config) => {
    let enhanced = existingContent;

    // Replace weak verbs with strong ones
    const weakVerbs = {
      'did': ['developed', 'implemented', 'created', 'designed', 'built'],
      'made': ['developed', 'created', 'designed', 'built', 'implemented'],
      'worked on': ['developed', 'contributed to', 'collaborated on', 'led development of'],
      'helped': ['assisted', 'supported', 'contributed to', 'facilitated'],
      'knew': ['proficient in', 'experienced with', 'skilled in', 'expertise in'],
      'used': ['implemented', 'utilized', 'leveraged', 'applied', 'integrated']
    };

    Object.entries(weakVerbs).forEach(([weak, strongs]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      const strong = strongs[Math.floor(Math.random() * strongs.length)];
      enhanced = enhanced.replace(regex, strong);
    });

    // Add ATS keywords based on section
    const atsKeywords = getATSKeywordsForSection(config.title);
    if (atsKeywords.length > 0) {
      const randomKeyword = atsKeywords[Math.floor(Math.random() * atsKeywords.length)];
      enhanced += ` ${randomKeyword}.`;
    }

    return enhanced;
  };

  const generateNewContent = (config) => {
    const templates = {
      summary: [
        "Experienced {role} with {years}+ years in {field}, specializing in {skills}. Demonstrated expertise in {achievements} and proven track record of {outcomes}. Passionate about {interests} and committed to delivering {results}.",
        "Results-driven {role} with extensive experience in {field} and strong background in {skills}. Successfully {achievements} while maintaining focus on {goals}. Skilled in {methodologies} and dedicated to {objectives}.",
        "Dynamic {role} with {years}+ years of experience in {field}, combining technical expertise in {skills} with strong {soft_skills}. Proven ability to {achievements} and drive {outcomes} in fast-paced environments."
      ],
      experience: [
        "Led development of {project} using {technologies}, improving {metric} by {percentage}% and reducing {cost} by {amount}",
        "Managed team of {number} developers to deliver {project} on time and under budget, achieving {outcome}",
        "Designed and implemented {solution} that {achievement}, resulting in {benefit} for {stakeholders}",
        "Collaborated with cross-functional teams to {action}, increasing {metric} by {percentage}%"
      ],
      skills: [
        "Technical Skills: {technical_skills}",
        "Soft Skills: {soft_skills}",
        "Programming Languages: {languages}",
        "Frameworks & Tools: {frameworks}",
        "Methodologies: {methodologies}"
      ],
      projects: [
        "Developed {project_name} using {technologies}, implementing {features} and achieving {outcomes}",
        "Built {project_name} with {technologies}, focusing on {objectives} and delivering {results}",
        "Created {project_name} that {description}, utilizing {technologies} and following {methodologies}"
      ],
      education: [
        "Bachelor's degree in {field} from {institution}, graduating with {gpa} GPA",
        "{degree} in {field} from {institution}, with specialization in {specialization}",
        "Completed {degree} program at {institution}, focusing on {focus_areas} and achieving {achievements}"
      ],
      certifications: [
        "{certification_name} from {issuing_organization}, obtained in {year}",
        "Certified {certification_type} by {issuing_organization}, completed {year}",
        "{certification_name} certification from {issuing_organization}, earned {year}"
      ]
    };

    const template = templates[config.title.toLowerCase()] || templates.summary;
    const selectedTemplate = template[Math.floor(Math.random() * template.length)];

    // Fill template with realistic data
    const filledContent = fillTemplate(selectedTemplate, config.title);
    
    return filledContent;
  };

  const fillTemplate = (template, sectionType) => {
    const data = {
      role: ['Software Engineer', 'Developer', 'Full-Stack Developer', 'Frontend Developer', 'Backend Developer'],
      years: ['3', '5', '7', '10'],
      field: ['web development', 'software engineering', 'full-stack development', 'application development'],
      skills: ['React, Node.js, Python', 'JavaScript, TypeScript, AWS', 'Java, Spring Boot, Microservices', 'Python, Django, PostgreSQL'],
      achievements: ['delivering scalable applications', 'leading development teams', 'optimizing system performance', 'implementing best practices'],
      outcomes: ['improved user experience', 'increased system efficiency', 'reduced development time', 'enhanced team productivity'],
      interests: ['innovation', 'continuous learning', 'problem-solving', 'user experience'],
      results: ['high-quality solutions', 'excellent user experiences', 'efficient systems', 'successful projects'],
      soft_skills: ['communication skills', 'leadership abilities', 'problem-solving capabilities', 'team collaboration'],
      objectives: ['continuous improvement', 'excellence in delivery', 'innovation in technology', 'user satisfaction'],
      improvement_objectives: ['continuous improvement', 'excellence in delivery', 'innovation in technology', 'user satisfaction'],
      project: ['web applications', 'mobile apps', 'API services', 'data processing systems'],
      technologies: ['React and Node.js', 'Python and Django', 'Java and Spring Boot', 'TypeScript and Angular'],
      metric: ['performance', 'efficiency', 'user engagement', 'processing speed'],
      percentage: ['25', '30', '40', '50'],
      cost: ['operational costs', 'development time', 'maintenance overhead', 'resource usage'],
      amount: ['20%', '30%', '40%', '50%'],
      number: ['3', '5', '7', '10'],
      solution: ['innovative solutions', 'efficient workflows', 'user-friendly interfaces', 'scalable architectures'],
      achievement: ['streamlined business processes', 'enhanced user experience', 'improved system performance', 'reduced technical debt'],
      benefit: ['increased productivity', 'better user satisfaction', 'improved efficiency', 'cost savings'],
      stakeholders: ['end users', 'business teams', 'development teams', 'management'],
      action: ['implement new features', 'optimize existing systems', 'resolve technical challenges', 'deliver projects'],
      technical_skills: ['JavaScript, React, Node.js, Python, SQL', 'Java, Spring Boot, Microservices, AWS', 'TypeScript, Angular, .NET, Azure', 'Python, Django, PostgreSQL, Docker'],
      leadership_skills: ['Leadership, Communication, Problem Solving', 'Teamwork, Adaptability, Time Management', 'Creativity, Strategic Thinking, Collaboration', 'Critical Thinking, Decision Making, Conflict Resolution'],
      languages: ['JavaScript, Python, Java, SQL', 'TypeScript, Python, C#, SQL', 'Python, JavaScript, Go, Rust', 'Java, Python, JavaScript, SQL'],
      frameworks: ['React, Node.js, Express, Django', 'Spring Boot, Angular, .NET Core', 'Vue.js, Laravel, Flask, FastAPI', 'Spring, React, Django, FastAPI'],
      methodologies: ['Agile, Scrum, DevOps, TDD', 'Scrum, Kanban, CI/CD, BDD', 'Agile, Lean, DevOps, XP', 'Scrum, Waterfall, DevOps, TDD'],
      project_name: ['E-commerce Platform', 'Task Management App', 'Data Analytics Dashboard', 'API Gateway Service'],
      features: ['user authentication', 'real-time updates', 'data visualization', 'API integration'],
      project_objectives: ['user experience optimization', 'performance improvement', 'scalability enhancement', 'security implementation'],
      project_description: ['streamlined business processes', 'enhanced user experience', 'improved system performance', 'reduced technical debt'],
      degree: ['Bachelor\'s', 'Master\'s', 'PhD'],
      institution: ['University of Technology', 'State University', 'Technical Institute', 'Engineering College'],
      gpa: ['3.8/4.0', '3.9/4.0', '3.7/4.0', '4.0/4.0'],
      specialization: ['Software Engineering', 'Computer Science', 'Information Technology', 'Data Science'],
      focus_areas: ['web development', 'software architecture', 'data structures', 'algorithms'],
      academic_achievements: ['Dean\'s List', 'Honors Program', 'Research Assistant', 'Teaching Assistant'],
      certification_name: ['AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Certified', 'Oracle Certified'],
      issuing_organization: ['Amazon Web Services', 'Google Cloud Platform', 'Microsoft', 'Oracle'],
      year: ['2023', '2024', '2022', '2021'],
      certification_type: ['Software Developer', 'Cloud Engineer', 'Solutions Architect', 'Database Administrator']
    };

    let filled = template;
    Object.entries(data).forEach(([key, values]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      const value = values[Math.floor(Math.random() * values.length)];
      filled = filled.replace(regex, value);
    });

    return filled;
  };

  const getATSKeywordsForSection = (sectionTitle) => {
    const keywords = {
      'Professional Summary': ['problem-solving', 'innovation', 'leadership', 'expertise'],
      'Work Experience': ['achievement', 'optimization', 'collaboration', 'delivery'],
      'Skills Section': ['proficiency', 'expertise', 'competency', 'mastery'],
      'Projects': ['development', 'implementation', 'deployment', 'integration'],
      'Education': ['academic excellence', 'specialization', 'achievement', 'focus'],
      'Certifications': ['professional development', 'expertise validation', 'skill verification', 'competency recognition']
    };

    return keywords[sectionTitle] || keywords['Professional Summary'];
  };

  const handleApplyContent = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent);
      setGeneratedContent('');
    }
  };

  const handleRegenerate = () => {
    generateContent(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
            AI {config.title} Writer
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => generateContent(false)}
            disabled={isGenerating}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
          >
            <Wand2 className="w-3 h-3" />
            <span>Generate</span>
          </button>
          {currentContent && (
            <button
              onClick={() => generateContent(true)}
              disabled={isGenerating}
              className="btn-primary text-xs px-3 py-1.5 flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Enhance</span>
            </button>
          )}
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Loader className="w-4 h-4 text-purple-600 animate-spin" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                AI is writing your {config.title.toLowerCase()}...
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Analyzing content and generating optimized text
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && !isGenerating && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Generated Content
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={handleRegenerate}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Regenerate
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {generatedContent}
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setGeneratedContent('')}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Discard
            </button>
            <button
              onClick={handleApplyContent}
              className="btn-primary text-xs px-3 py-1.5 flex items-center space-x-1"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Apply to Form</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-3">
        <p className="text-xs text-purple-700 dark:text-purple-300">
          💡 AI generates ATS-friendly content with strong action verbs and relevant keywords
        </p>
      </div>
    </div>
  );
};

export default AISectionWriter;
