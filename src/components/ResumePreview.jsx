import React from 'react';
import TemplateClassic from './templates/TemplateClassic';
import TemplateModern from './templates/TemplateModern';
import TemplateMinimal from './templates/TemplateMinimal';
import TemplateCorporate from './templates/TemplateCorporate';
import TemplateCreative from './templates/TemplateCreative';
import TemplateCompact from './templates/TemplateCompact';
import ExportButton from './ExportButton';

const ResumePreview = ({ resumeData, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'classic': return <TemplateClassic data={resumeData} />;
      case 'modern': return <TemplateModern data={resumeData} />;
      case 'minimal': return <TemplateMinimal data={resumeData} />;
      case 'corporate': return <TemplateCorporate data={resumeData} />;
      case 'creative': return <TemplateCreative data={resumeData} />;
      case 'compact': return <TemplateCompact data={resumeData} />;
      default: return <TemplateClassic data={resumeData} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Preview</h2>
          <p className="text-gray-600 dark:text-gray-400">Preview your resume with the {template.charAt(0).toUpperCase() + template.slice(1)} template</p>
        </div>
        <ExportButton resumeData={resumeData} template={template} />
      </div>
      <div className="resume-paper">
        {renderTemplate()}
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">💡 ATS Compatibility Note</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">This resume is designed to be ATS-friendly with clean text layouts, standard fonts, and structured content that Applicant Tracking Systems can easily parse and analyze.</p>
      </div>
    </div>
  );
};

export default ResumePreview;
