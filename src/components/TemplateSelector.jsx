import React from 'react';

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and focused layout' },
    { id: 'corporate', name: 'Corporate', description: 'Formal and structured, emphasizes work history' },
    { id: 'creative', name: 'Creative', description: 'Clean typography with subtle color accents' },
    { id: 'compact', name: 'Compact', description: 'Single-page, tightly packed layout' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Template:</span>
      <select
        value={selectedTemplate}
        onChange={(e) => onTemplateChange(e.target.value)}
        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;
