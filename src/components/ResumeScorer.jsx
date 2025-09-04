import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Star, Target, Award } from 'lucide-react';

const ResumeScorer = ({ resumeData, isVisible = true }) => {
  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Check if resume has meaningful data to analyze
  const hasMeaningfulData = (data) => {
    if (!data) return false;
    
    // Check for basic required fields
    const hasBasicInfo = data.fullName && data.fullName.trim().length > 0;
    
    // Check for at least one substantial section
    const hasSummary = data.summary && data.summary.trim().length > 50;
    const hasExperience = data.experience && data.experience.length > 0 && 
      data.experience.some(exp => exp.description && exp.description.trim().length > 20);
    const hasEducation = data.education && data.education.length > 0;
    const hasSkills = data.skills && (
      (data.skills.technical && data.skills.technical.trim().length > 10) ||
      (data.skills.soft && data.skills.soft.trim().length > 10)
    );
    const hasProjects = data.projects && data.projects.length > 0;
    const hasCertifications = data.certifications && data.certifications.length > 0;
    
    return hasBasicInfo && (hasSummary || hasExperience || hasEducation || hasSkills || hasProjects || hasCertifications);
  };

  const analyzeResume = useCallback(async () => {
    // Only analyze if there's meaningful data
    if (!resumeData || !hasMeaningfulData(resumeData)) {
      setScores({});
      setOverallScore(0);
      setSuggestions([]);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const calculatedScores = calculateScores();
      const calculatedOverall = calculateOverallScore(calculatedScores);
      const calculatedSuggestions = generateSuggestions(calculatedScores, calculatedOverall);
      
      setScores(calculatedScores);
      setOverallScore(calculatedOverall);
      setSuggestions(calculatedSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  }, [resumeData, calculateScores]);

  useEffect(() => {
    if (resumeData && isVisible) {
      analyzeResume();
    }
  }, [resumeData, isVisible, analyzeResume]);

  if (!isVisible) return null;

  const calculateScores = () => {
    const scores = {};

    // Summary Quality Score (0-10)
    scores.summary = calculateSummaryScore();

    // Skills Relevance Score (0-10)
    scores.skills = calculateSkillsScore();

    // Experience Strength Score (0-10)
    scores.experience = calculateExperienceScore();

    // Education Quality Score (0-10)
    scores.education = calculateEducationScore();

    // Projects Quality Score (0-10)
    scores.projects = calculateProjectsScore();

    // Certifications Score (0-10)
    scores.certifications = calculateCertificationsScore();

    // Contact Information Score (0-10)
    scores.contact = calculateContactScore();

    return scores;
  };

  const calculateSummaryScore = () => {
    if (!resumeData.summary) return 2;
    
    let score = 5; // Base score
    
    const summary = resumeData.summary.toLowerCase();
    
    // Length scoring
    if (resumeData.summary.length >= 150 && resumeData.summary.length <= 300) score += 2;
    else if (resumeData.summary.length > 100) score += 1;
    
    // Content quality scoring
    if (summary.includes('experience') || summary.includes('expertise')) score += 1;
    if (summary.includes('skills') || summary.includes('proficient')) score += 1;
    if (summary.includes('achievement') || summary.includes('success')) score += 1;
    
    // Action verbs scoring
    const actionVerbs = ['developed', 'implemented', 'led', 'managed', 'created', 'designed', 'optimized'];
    const hasActionVerbs = actionVerbs.some(verb => summary.includes(verb));
    if (hasActionVerbs) score += 1;
    
    return Math.min(10, score);
  };

  const calculateSkillsScore = () => {
    if (!resumeData.skills) return 3;
    
    let score = 5; // Base score
    
    // Technical skills
    if (resumeData.skills.technical && resumeData.skills.technical.length > 20) {
      score += 2;
      if (resumeData.skills.technical.includes(',')) score += 1; // Multiple skills
    }
    
    // Soft skills
    if (resumeData.skills.soft && resumeData.skills.soft.length > 15) {
      score += 1;
    }
    
    // Languages
    if (resumeData.skills.languages && resumeData.skills.languages.length > 10) {
      score += 1;
    }
    
    return Math.min(10, score);
  };

  const calculateExperienceScore = () => {
    if (!resumeData.experience || resumeData.experience.length === 0) return 2;
    
    let score = 5; // Base score
    
    // Number of experiences
    if (resumeData.experience.length >= 2) score += 1;
    if (resumeData.experience.length >= 3) score += 1;
    
    // Quality of descriptions
    let hasGoodDescriptions = false;
    resumeData.experience.forEach(exp => {
      if (exp.description && exp.description.length > 100) {
        hasGoodDescriptions = true;
        if (exp.description.includes('%') || exp.description.includes('improved') || 
            exp.description.includes('increased') || exp.description.includes('reduced')) {
          score += 1;
        }
      }
    });
    
    if (hasGoodDescriptions) score += 1;
    
    // Current position
    const hasCurrentPosition = resumeData.experience.some(exp => exp.current);
    if (hasCurrentPosition) score += 1;
    
    return Math.min(10, score);
  };

  const calculateEducationScore = () => {
    if (!resumeData.education || resumeData.education.length === 0) return 3;
    
    let score = 5; // Base score
    
    // Number of education entries
    if (resumeData.education.length >= 2) score += 1;
    
    // Quality of information
    let hasGoodInfo = false;
    resumeData.education.forEach(edu => {
      if (edu.institution && edu.degree && edu.field) {
        hasGoodInfo = true;
        if (edu.gpa && edu.gpa.length > 0) score += 1;
        if (edu.achievements && edu.achievements.length > 20) score += 1;
      }
    });
    
    if (hasGoodInfo) score += 1;
    
    return Math.min(10, score);
  };

  const calculateProjectsScore = () => {
    if (!resumeData.projects || resumeData.projects.length === 0) return 3;
    
    let score = 5; // Base score
    
    // Number of projects
    if (resumeData.projects.length >= 2) score += 1;
    if (resumeData.projects.length >= 3) score += 1;
    
    // Quality of project descriptions
    let hasGoodDescriptions = false;
    resumeData.projects.forEach(project => {
      if (project.description && project.description.length > 50) {
        hasGoodDescriptions = true;
        if (project.technologies && project.technologies.length > 10) score += 1;
        if (project.link && project.link.length > 0) score += 1;
      }
    });
    
    if (hasGoodDescriptions) score += 1;
    
    return Math.min(10, score);
  };

  const calculateCertificationsScore = () => {
    if (!resumeData.certifications || resumeData.certifications.length === 0) return 3;
    
    let score = 5; // Base score
    
    // Number of certifications
    if (resumeData.certifications.length >= 2) score += 1;
    if (resumeData.certifications.length >= 3) score += 1;
    
    // Quality of certification info
    let hasGoodInfo = false;
    resumeData.certifications.forEach(cert => {
      if (cert.name && cert.issuer) {
        hasGoodInfo = true;
        if (cert.date && cert.date.length > 0) score += 1;
        if (cert.link && cert.link.length > 0) score += 1;
      }
    });
    
    if (hasGoodInfo) score += 1;
    
    return Math.min(10, score);
  };

  const calculateContactScore = () => {
    let score = 5; // Base score
    
    // Required fields
    if (resumeData.fullName && resumeData.fullName.length > 0) score += 1;
    if (resumeData.email && resumeData.email.length > 0) score += 1;
    if (resumeData.phone && resumeData.phone.length > 0) score += 1;
    if (resumeData.location && resumeData.location.length > 0) score += 1;
    
    // Optional but valuable fields
    if (resumeData.linkedin && resumeData.linkedin.length > 0) score += 1;
    if (resumeData.website && resumeData.website.length > 0) score += 1;
    
    return Math.min(10, score);
  };

  const calculateOverallScore = (sectionScores) => {
    const totalScore = Object.values(sectionScores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = Object.keys(sectionScores).length * 10;
    return Math.round((totalScore / maxPossibleScore) * 100);
  };

  const generateSuggestions = (sectionScores, overall) => {
    const suggestions = [];
    
    // Overall suggestions
    if (overall < 60) {
      suggestions.push('Your resume needs significant improvement to be competitive.');
      suggestions.push('Focus on adding more content and improving existing sections.');
    } else if (overall < 80) {
      suggestions.push('Your resume is good but could be improved for better results.');
      suggestions.push('Consider enhancing weak sections and adding more details.');
    } else {
      suggestions.push('Excellent resume! Minor improvements could make it perfect.');
    }
    
    // Section-specific suggestions
    if (sectionScores.summary < 7) {
      suggestions.push('Enhance your professional summary with more specific achievements and skills.');
    }
    
    if (sectionScores.skills < 7) {
      suggestions.push('Add more technical skills and consider categorizing them better.');
    }
    
    if (sectionScores.experience < 7) {
      suggestions.push('Improve work experience descriptions with quantifiable achievements.');
    }
    
    if (sectionScores.education < 7) {
      suggestions.push('Add more details about your educational background and achievements.');
    }
    
    if (sectionScores.projects < 7) {
      suggestions.push('Include more project details, technologies used, and outcomes achieved.');
    }
    
    if (sectionScores.certifications < 7) {
      suggestions.push('Add relevant certifications and professional development courses.');
    }
    
    if (sectionScores.contact < 7) {
      suggestions.push('Ensure all contact information is complete and professional.');
    }
    
    return suggestions.slice(0, 8); // Limit to top 8 suggestions
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 6) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 4) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 8) return 'border-green-200 dark:border-green-800';
    if (score >= 6) return 'border-yellow-200 dark:border-yellow-800';
    if (score >= 4) return 'border-orange-200 dark:border-orange-800';
    return 'border-red-200 dark:border-red-800';
  };

  const getOverallScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getOverallScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getOverallScoreBorderColor = (score) => {
    if (score >= 80) return 'border-green-200 dark:border-green-800';
    if (score >= 60) return 'border-yellow-200 dark:border-yellow-800';
    if (score >= 40) return 'border-orange-200 dark:border-orange-800';
    return 'border-red-200 dark:border-red-800';
  };

  const getOverallScoreLabel = (score) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Resume Score & Analysis
        </h2>
        <div className="flex items-center space-x-2 ml-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Smart Scoring</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Analyzing Your Resume...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Evaluating content quality, structure, and ATS compatibility
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overall Score */}
        {overallScore > 0 && !isAnalyzing && (
          <div className={`rounded-lg p-6 border ${getOverallScoreBorderColor(overallScore)} ${getOverallScoreBgColor(overallScore)}`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Overall Resume Score
                </h3>
              </div>
              
              <div className="mb-6">
                <div className={`text-6xl font-bold ${getOverallScoreColor(overallScore)}`}>
                  {overallScore}%
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {getOverallScoreLabel(overallScore)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {overallScore >= 80 ? 'Your resume is highly competitive!' : 
                   overallScore >= 60 ? 'Your resume is good but could be improved.' : 
                   overallScore >= 40 ? 'Your resume needs significant improvement.' : 'Your resume needs major improvements.'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    overallScore >= 80 ? 'bg-green-500' : 
                    overallScore >= 60 ? 'bg-yellow-500' : 
                    overallScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Section Scores */}
        {Object.keys(scores).length > 0 && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(scores).map(([section, score]) => (
              <div key={section} className={`rounded-lg p-4 border ${getScoreBorderColor(score)} ${getScoreBgColor(score)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                    {section.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                    {score}/10
                  </div>
                </div>
                
                {/* Section Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      score >= 8 ? 'bg-green-500' : 
                      score >= 6 ? 'bg-yellow-500' : 
                      score >= 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(score / 10) * 100}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {score >= 8 ? 'Excellent' : 
                   score >= 6 ? 'Good' : 
                   score >= 4 ? 'Fair' : 'Needs Improvement'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && !isAnalyzing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Improvement Suggestions
            </h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-blue-700 dark:text-blue-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            💡 Scoring Criteria
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• <strong>Summary:</strong> Content quality, length, action verbs</li>
            <li>• <strong>Skills:</strong> Relevance, categorization, completeness</li>
            <li>• <strong>Experience:</strong> Descriptions, achievements, current roles</li>
            <li>• <strong>Education:</strong> Information completeness, achievements</li>
            <li>• <strong>Projects:</strong> Descriptions, technologies, outcomes</li>
            <li>• <strong>Certifications:</strong> Relevance, verification links</li>
            <li>• <strong>Contact:</strong> Completeness, professionalism</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeScorer;
