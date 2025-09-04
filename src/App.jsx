import React, { useState, useEffect } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import ThemeToggle from './components/ThemeToggle';
import TemplateSelector from './components/TemplateSelector';
import PDFUploader from './components/PDFUploader';
import JobDescriptionMatcher from './components/JobDescriptionMatcher';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import ResumeScorer from './components/ResumeScorer';

import { FileText, Edit3, Menu, X, Target } from 'lucide-react';
import { validateInput } from './utils/security';

function App() {
  const [currentView, setCurrentView] = useState('form');
  const [resumeData, setResumeData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    education: [{
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
      achievements: ''
    }],
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    skills: {
      technical: '',
      soft: '',
      languages: ''
    },
    projects: [{
      name: '',
      description: '',
      technologies: '',
      link: ''
    }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      link: ''
    }]
  });
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Premium Features State
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [enableJobMatch, setEnableJobMatch] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedResumeData = localStorage.getItem('resumeData');
    if (savedResumeData) {
      try {
        setResumeData(JSON.parse(savedResumeData));
      } catch (error) {
        console.error('Error parsing saved resume data:', error);
      }
    }

    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }

    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
    }

    // Check for mobile device
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setCurrentView('form'); // Default to form view on mobile
    }
  }, []);

  // Save data to localStorage whenever resumeData changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  // Save template selection to localStorage
  useEffect(() => {
    localStorage.setItem('selectedTemplate', selectedTemplate);
  }, [selectedTemplate]);

  // Save theme preference to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Validate form data
  const validateFormData = (data) => {
    const errors = {};
    
    if (data.email && !validateInput(data.email, 'email')) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (data.phone && !validateInput(data.phone, 'phone')) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (data.website && !validateInput(data.website, 'url')) {
      errors.website = 'Please enter a valid URL';
    }
    
    if (data.linkedin && !validateInput(data.linkedin, 'url')) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    
    if (data.fullName && !validateInput(data.fullName, 'name')) {
      errors.fullName = 'Please enter a valid name';
    }
    
    // Validate lengths
    if (data.summary && data.summary.length > 500) {
      errors.summary = 'Summary must be less than 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormUpdate = (newData, skipValidation = false) => {
    // Validate data before updating (skip validation for PDF uploads)
    if (skipValidation || validateFormData(newData)) {
      setResumeData(newData);
    } else {
      console.log('Validation failed for data:', newData);
    }
  };

  const toggleView = () => {
    setCurrentView(currentView === 'form' ? 'preview' : 'form');
    setIsMobileMenuOpen(false); // Close mobile menu when switching views
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                ATS Resume Builder
              </h1>
              <div className="hidden sm:block">
                <TemplateSelector 
                  selectedTemplate={selectedTemplate} 
                  onTemplateChange={setSelectedTemplate} 
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
              
              {/* Premium Features Toggle */}
              <button
                onClick={() => setShowPremiumFeatures(!showPremiumFeatures)}
                className={`btn-secondary flex items-center space-x-2 transition-all duration-300 ${
                  showPremiumFeatures ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700' : ''
                }`}
              >
                <Target className="w-4 h-4" />
                <span>{showPremiumFeatures ? 'Hide Premium' : 'Show Premium'}</span>
              </button>
              
              <button 
                onClick={toggleView} 
                className="btn-primary flex items-center space-x-2"
              >
                {currentView === 'form' ? (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Preview</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Template Selector */}
          <div className="md:hidden pb-4">
            <TemplateSelector 
              selectedTemplate={selectedTemplate} 
              onTemplateChange={setSelectedTemplate} 
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 py-4 space-y-2">
              {/* Premium Features Toggle */}
              <button
                onClick={() => setShowPremiumFeatures(!showPremiumFeatures)}
                className={`w-full btn-secondary flex items-center justify-center space-x-2 transition-all duration-300 ${
                  showPremiumFeatures ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700' : ''
                }`}
              >
                <Target className="w-4 h-4" />
                <span>{showPremiumFeatures ? 'Hide Premium' : 'Show Premium'}</span>
              </button>
              
              <button
                onClick={toggleView}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {currentView === 'form' ? (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Switch to Preview</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Switch to Edit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Validation Errors Display */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              ⚠️ Please fix the following validation errors:
            </h3>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>• <strong>{field}:</strong> {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Premium Features Section */}
        {showPremiumFeatures && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-2 mb-6">
                <Target className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🚀 Premium Features
                </h2>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                    Free for All Users
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PDF Upload */}
                <PDFUploader onPDFParsed={(data) => handleFormUpdate(data, true)} />
                

                
                {/* Job Description Matcher */}
                <JobDescriptionMatcher 
                  resumeData={resumeData} 
                  isEnabled={enableJobMatch}
                />
                
                {/* Resume Scorer */}
                <ResumeScorer resumeData={resumeData} isVisible={true} />
                
                {/* Cover Letter Generator */}
                <CoverLetterGenerator 
                  resumeData={resumeData}
                  jobDescription={jobDescription}
                  isVisible={true}
                />
              </div>
              
              {/* Job Description Input for Premium Features */}
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Job Description Input
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableJobMatch}
                      onChange={(e) => setEnableJobMatch(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Job Match
                    </span>
                  </label>
                </div>
                
                {enableJobMatch && (
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input-field min-h-[120px] resize-y"
                    placeholder="Paste the job description here to enable job matching, cover letter generation, and other premium features..."
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {currentView === 'form' ? (
          <ResumeForm resumeData={resumeData} onUpdate={handleFormUpdate} />
        ) : (
          <ResumePreview resumeData={resumeData} template={selectedTemplate} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Built with React & TailwindCSS • ATS-Optimized Resume Builder</p>
            <p className="mt-1">Deployed on Vercel • Secure & Responsive</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
