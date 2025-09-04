import React, { useState, useEffect, useCallback } from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle, XCircle, Star } from 'lucide-react';

const JobDescriptionMatcher = ({ resumeData, isEnabled }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ATS Keywords for different industries
  const atsKeywords = {
    technical: [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB',
      'AWS', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL', 'TypeScript',
      'Angular', 'Vue.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
      'Microservices', 'CI/CD', 'DevOps', 'Agile', 'Scrum', 'JIRA'
    ],
    soft: [
      'Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Critical Thinking',
      'Time Management', 'Project Management', 'Adaptability', 'Creativity',
      'Collaboration', 'Strategic Planning', 'Decision Making', 'Conflict Resolution'
    ],
    methodologies: [
      'Agile Development', 'Scrum', 'Kanban', 'Waterfall', 'DevOps',
      'Test-Driven Development', 'Behavior-Driven Development', 'Lean Development'
    ]
  };

  const calculateMatchScore = useCallback(() => {
    if (!jobDescription.trim() || !resumeData) return 0;

    const jdText = jobDescription.toLowerCase();
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    
    let score = 0;
    let totalKeywords = 0;
    let matchedKeywords = 0;

    // Check technical skills
    atsKeywords.technical.forEach(keyword => {
      totalKeywords++;
      if (jdText.includes(keyword.toLowerCase()) && resumeText.includes(keyword.toLowerCase())) {
        matchedKeywords++;
        score += 3; // Technical skills are weighted higher
      }
    });

    // Check soft skills
    atsKeywords.soft.forEach(keyword => {
      totalKeywords++;
      if (jdText.includes(keyword.toLowerCase()) && resumeText.includes(keyword.toLowerCase())) {
        matchedKeywords++;
        score += 2;
      }
    });

    // Check methodologies
    atsKeywords.methodologies.forEach(keyword => {
      totalKeywords++;
      if (jdText.includes(keyword.toLowerCase()) && resumeText.includes(keyword.toLowerCase())) {
        matchedKeywords++;
        score += 2;
      }
    });

    // Calculate percentage
    const percentage = Math.round((matchedKeywords / totalKeywords) * 100);
    
    // Bonus points for good structure and content
    if (resumeData.summary && resumeData.summary.length > 100) score += 10;
    if (resumeData.experience && resumeData.experience.length > 0) score += 15;
    if (resumeData.education && resumeData.education.length > 0) score += 10;
    if (resumeData.skills && resumeData.skills.technical) score += 10;

    // Cap at 100
    return Math.min(100, Math.round(percentage + score));
  }, [jobDescription, resumeData, atsKeywords.technical, atsKeywords.soft, atsKeywords.methodologies]);

  const findMissingKeywords = useCallback(() => {
    if (!jobDescription.trim() || !resumeData) return [];

    const jdText = jobDescription.toLowerCase();
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const missing = [];

    // Check which keywords from JD are missing in resume
    atsKeywords.technical.forEach(keyword => {
      if (jdText.includes(keyword.toLowerCase()) && !resumeText.includes(keyword.toLowerCase())) {
        missing.push({ keyword, category: 'Technical Skill', priority: 'High' });
      }
    });

    atsKeywords.soft.forEach(keyword => {
      if (jdText.includes(keyword.toLowerCase()) && !resumeText.includes(keyword.toLowerCase())) {
        missing.push({ keyword, category: 'Soft Skill', priority: 'Medium' });
      }
    });

    atsKeywords.methodologies.forEach(keyword => {
      if (jdText.includes(keyword.toLowerCase()) && !resumeText.includes(keyword.toLowerCase())) {
        missing.push({ keyword, category: 'Methodology', priority: 'Medium' });
      }
    });

    return missing.slice(0, 10); // Limit to top 10 missing keywords
  }, [jobDescription, resumeData, atsKeywords.technical, atsKeywords.soft, atsKeywords.methodologies]);

  const generateSuggestions = useCallback(() => {
    const sugg = [];

    if (matchScore < 30) {
      sugg.push('Your resume needs significant improvement to match this job description.');
      sugg.push('Consider adding more relevant technical skills and experience.');
    } else if (matchScore < 60) {
      sugg.push('Your resume has some alignment but could be improved.');
      sugg.push('Focus on adding missing keywords and quantifying achievements.');
    } else if (matchScore < 80) {
      sugg.push('Good match! Minor improvements could increase your chances.');
      sugg.push('Consider adding a few missing skills and enhancing descriptions.');
    } else {
      sugg.push('Excellent match! Your resume aligns well with this position.');
      sugg.push('Consider minor tweaks to optimize for specific requirements.');
    }

    if (missingKeywords.length > 0) {
      sugg.push(`Add ${missingKeywords.length} missing keywords to improve your match score.`);
    }

    return sugg;
  }, [matchScore, missingKeywords]);

  const analyzeMatch = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const score = calculateMatchScore();
      const missing = findMissingKeywords();
      const sugg = generateSuggestions();
      
      setMatchScore(score);
      setMissingKeywords(missing);
      setSuggestions(sugg);
      setIsAnalyzing(false);
    }, 1500);
  }, [calculateMatchScore, findMissingKeywords, generateSuggestions]);

  useEffect(() => {
    if (isEnabled && jobDescription.trim() && resumeData) {
      analyzeMatch();
    } else {
      setMatchScore(0);
      setMissingKeywords([]);
      setSuggestions([]);
    }
  }, [jobDescription, resumeData, isEnabled, analyzeMatch]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 80) return 'border-green-200 dark:border-green-800';
    if (score >= 60) return 'border-yellow-200 dark:border-yellow-800';
    if (score >= 40) return 'border-orange-200 dark:border-orange-800';
    return 'border-red-200 dark:border-red-800';
  };

  if (!isEnabled) return null;

  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Job Description Matcher
        </h2>
        <div className="flex items-center space-x-2 ml-4">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Smart Matching</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="Paste the job description here to analyze how well your resume matches..."
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The system will analyze your resume against this job description and provide a match score.
          </p>
        </div>

        {/* Analysis Results */}
        {isAnalyzing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Analyzing Resume Match...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Comparing skills, experience, and keywords
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Match Score */}
        {matchScore !== null && !isAnalyzing && (
          <div className={`rounded-lg p-6 border ${getScoreBorderColor(matchScore)} ${getScoreBgColor(matchScore)}`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Resume Match Score
                </h3>
              </div>
              
              <div className="mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(matchScore)}`}>
                  {matchScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {matchScore >= 80 ? 'Excellent Match' : 
                   matchScore >= 60 ? 'Good Match' : 
                   matchScore >= 40 ? 'Fair Match' : 'Poor Match'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    matchScore >= 80 ? 'bg-green-500' : 
                    matchScore >= 60 ? 'bg-yellow-500' : 
                    matchScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${matchScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {missingKeywords.length > 0 && !isAnalyzing && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Missing Keywords ({missingKeywords.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {missingKeywords.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700 dark:text-amber-300">
                    {item.keyword}
                  </span>
                  <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded">
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && !isAnalyzing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
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
            💡 How Matching Works
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Analyzes your resume against the job description</li>
            <li>• Identifies missing keywords and skills</li>
            <li>• Provides actionable improvement suggestions</li>
            <li>• Scores based on keyword matches and content quality</li>
            <li>• Higher scores increase your chances of passing ATS</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionMatcher;
