// Smart Resume Enhancer
// This utility transforms vague resume input into strong, achievement-based content
// and injects relevant ATS keywords for better visibility

import { getRelevantKeywords, ATS_KEYWORDS } from './atsKeywords';

// Strong action verbs to replace weak ones
const STRONG_ACTION_VERBS = {
  'did': ['developed', 'implemented', 'created', 'designed', 'built'],
  'made': ['developed', 'created', 'designed', 'built', 'implemented'],
  'worked on': ['developed', 'contributed to', 'collaborated on', 'led development of'],
  'helped': ['assisted', 'supported', 'contributed to', 'facilitated'],
  'knew': ['proficient in', 'experienced with', 'skilled in', 'expertise in'],
  'used': ['implemented', 'utilized', 'leveraged', 'applied', 'integrated'],
  'learned': ['mastered', 'acquired expertise in', 'developed proficiency in'],
  'tried': ['successfully implemented', 'effectively developed', 'successfully created'],
  'started': ['initiated', 'launched', 'established', 'founded', 'created'],
  'finished': ['completed', 'delivered', 'finalized', 'accomplished', 'achieved']
};

// Achievement templates for different types of experience
const ACHIEVEMENT_TEMPLATES = {
  development: [
    "Developed and deployed {project} using {technologies}, improving {metric} by {percentage}%",
    "Built {project} with {technologies}, resulting in {outcome}",
    "Created {project} that {achievement}",
    "Implemented {feature} using {technologies}, reducing {metric} by {percentage}%"
  ],
  management: [
    "Led team of {number} developers to deliver {project} on time and under budget",
    "Managed {project} with {budget} budget, achieving {outcome}",
    "Coordinated cross-functional team to successfully launch {project}"
  ],
  optimization: [
    "Optimized {system} performance, improving {metric} by {percentage}%",
    "Enhanced {process} efficiency, reducing {metric} from {time1} to {time2}",
    "Streamlined {workflow}, increasing productivity by {percentage}%"
  ],
  collaboration: [
    "Collaborated with {stakeholders} to deliver {project}",
    "Worked closely with {team} to implement {solution}",
    "Partnered with {department} to achieve {goal}"
  ]
};

// Function to enhance text with strong action verbs
const enhanceActionVerbs = (text) => {
  let enhancedText = text;
  
  Object.entries(STRONG_ACTION_VERBS).forEach(([weakVerb, strongVerbs]) => {
    const regex = new RegExp(`\\b${weakVerb}\\b`, 'gi');
    const randomStrongVerb = strongVerbs[Math.floor(Math.random() * strongVerbs.length)];
    enhancedText = enhancedText.replace(regex, randomStrongVerb);
  });
  
  return enhancedText;
};

// Function to generate achievement-based descriptions
const generateAchievementDescription = (input, type = 'development') => {
  const templates = ACHIEVEMENT_TEMPLATES[type] || ACHIEVEMENT_TEMPLATES.development;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Extract technologies from input
  const techKeywords = ['React', 'Python', 'JavaScript', 'Node.js', 'MongoDB', 'SQL', 'AWS', 'Docker'];
  const foundTech = techKeywords.filter(tech => input.toLowerCase().includes(tech.toLowerCase()));
  
  // Generate realistic metrics
  const metrics = {
    project: input.includes('website') ? 'responsive web application' : 'software solution',
    technologies: foundTech.length > 0 ? foundTech.join(', ') : 'modern technologies',
    metric: ['performance', 'efficiency', 'user engagement', 'processing speed', 'response time'][Math.floor(Math.random() * 5)],
    percentage: Math.floor(Math.random() * 40) + 10, // 10-50%
    outcome: ['increased user satisfaction', 'improved system reliability', 'enhanced user experience'][Math.floor(Math.random() * 3)],
    achievement: ['streamlined business processes', 'enhanced user experience', 'improved system performance'][Math.floor(Math.random() * 3)],
    feature: ['user authentication', 'data visualization', 'real-time updates', 'responsive design'][Math.floor(Math.random() * 4)],
    number: Math.floor(Math.random() * 5) + 2, // 2-7
    budget: ['$50K', '$100K', '$200K'][Math.floor(Math.random() * 3)],
    goal: ['project completion', 'system optimization', 'user adoption'][Math.floor(Math.random() * 3)],
    stakeholders: ['product managers', 'designers', 'business analysts'][Math.floor(Math.random() * 3)],
    team: ['development team', 'design team', 'QA team'][Math.floor(Math.random() * 3)],
    solution: ['innovative solution', 'efficient workflow', 'user-friendly interface'][Math.floor(Math.random() * 3)],
    department: ['marketing', 'sales', 'operations'][Math.floor(Math.random() * 3)],
    system: ['database', 'application', 'website', 'API'][Math.floor(Math.random() * 4)],
    process: ['development workflow', 'deployment process', 'testing procedure'][Math.floor(Math.random() * 3)],
    workflow: ['development process', 'deployment pipeline', 'testing workflow'][Math.floor(Math.random() * 3)],
    time1: ['2 hours', '1 day', '3 days'][Math.floor(Math.random() * 3)],
    time2: ['30 minutes', '4 hours', '1 day'][Math.floor(Math.random() * 3)]
  };
  
  return template.replace(/\{(\w+)\}/g, (match, key) => metrics[key] || match);
};

// Function to enhance skills with relevant keywords
const enhanceSkills = (skills, inputText) => {
  const relevantKeywords = getRelevantKeywords(inputText);
  const enhancedSkills = { ...skills };
  
  // Enhance technical skills
  if (skills.technical) {
    const techKeywords = relevantKeywords.filter(keyword => 
      ATS_KEYWORDS.programmingLanguages.includes(keyword) ||
      ATS_KEYWORDS.webTechnologies.includes(keyword) ||
      ATS_KEYWORDS.databases.includes(keyword)
    );
    enhancedSkills.technical = [...new Set([skills.technical, ...techKeywords.slice(0, 5)])].join(', ');
  }
  
  // Enhance soft skills
  if (skills.soft) {
    const softKeywords = relevantKeywords.filter(keyword => 
      ATS_KEYWORDS.softSkills.includes(keyword) ||
      ATS_KEYWORDS.methodologies.includes(keyword)
    );
    enhancedSkills.soft = [...new Set([skills.soft, ...softKeywords.slice(0, 5)])].join(', ');
  }
  
  // Enhance languages
  if (skills.languages) {
    const languageKeywords = relevantKeywords.filter(keyword => 
      ATS_KEYWORDS.programmingLanguages.includes(keyword) ||
      keyword.toLowerCase().includes('language')
    );
    enhancedSkills.languages = [...new Set([skills.languages, ...languageKeywords.slice(0, 3)])].join(', ');
  }
  
  return enhancedSkills;
};

// Function to enhance experience descriptions
const enhanceExperience = (experience) => {
  return experience.map(exp => {
    if (!exp.description) return exp;
    
    // Generate achievement-based bullet points
    const bulletPoints = exp.description.split('\n').filter(line => line.trim()).map(line => {
      const enhancedLine = enhanceActionVerbs(line);
      
      // If line is too vague, enhance it
      if (enhancedLine.length < 50 || enhancedLine.includes('assisted') || enhancedLine.includes('helped')) {
        return generateAchievementDescription(enhancedLine, 'development');
      }
      
      return enhancedLine;
    });
    
    return {
      ...exp,
      description: bulletPoints.join('\n')
    };
  });
};

// Function to enhance projects
const enhanceProjects = (projects) => {
  return projects.map(project => {
    if (!project.description) return project;
    
    const enhancedDescription = enhanceActionVerbs(project.description);
    
    // Add technologies if missing
    if (!project.technologies) {
      const techKeywords = getRelevantKeywords(project.description);
      project.technologies = techKeywords.slice(0, 5).join(', ');
    }
    
    return {
      ...project,
      description: enhancedDescription
    };
  });
};

// Main enhancement function
export const enhanceResume = (resumeData, inputText, enableEnhancement = true) => {
  if (!enableEnhancement) {
    return resumeData;
  }
  
  const enhancedData = { ...resumeData };
  
  try {
    // Enhance summary
    if (enhancedData.summary) {
      enhancedData.summary = enhanceActionVerbs(enhancedData.summary);
    }
    
    // Enhance skills
    if (enhancedData.skills) {
      enhancedData.skills = enhanceSkills(enhancedData.skills, inputText);
    }
    
    // Enhance experience
    if (enhancedData.experience && enhancedData.experience.length > 0) {
      enhancedData.experience = enhanceExperience(enhancedData.experience);
    }
    
    // Enhance projects
    if (enhancedData.projects && enhancedData.projects.length > 0) {
      enhancedData.projects = enhanceProjects(enhancedData.projects);
    }
    
    // Enhance education achievements
    if (enhancedData.education && enhancedData.education.length > 0) {
      enhancedData.education = enhancedData.education.map(edu => {
        if (edu.achievements) {
          return {
            ...edu,
            achievements: enhanceActionVerbs(edu.achievements)
          };
        }
        return edu;
      });
    }
    
    console.log('Resume enhanced successfully with ATS keywords and strong action verbs');
    
  } catch (error) {
    console.error('Error enhancing resume:', error);
    // Return original data if enhancement fails
    return resumeData;
  }
  
  return enhancedData;
};

// Function to get enhancement suggestions
export const getEnhancementSuggestions = (inputText) => {
  const suggestions = [];
  
  if (inputText.toLowerCase().includes('worked on')) {
    suggestions.push('Replace "worked on" with stronger verbs like "developed", "implemented", or "created"');
  }
  
  if (inputText.toLowerCase().includes('helped')) {
    suggestions.push('Replace "helped" with "assisted", "supported", or "contributed to"');
  }
  
  if (inputText.toLowerCase().includes('made')) {
    suggestions.push('Replace "made" with "developed", "created", or "designed"');
  }
  
  const relevantKeywords = getRelevantKeywords(inputText);
  if (relevantKeywords.length > 0) {
    suggestions.push(`Consider adding these relevant skills: ${relevantKeywords.slice(0, 5).join(', ')}`);
  }
  
  return suggestions;
};

export default enhanceResume;
