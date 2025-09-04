import React from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

const ExperienceSection = ({ data, onUpdate, onAdd, onRemove }) => {
  // Ensure data is always an array
  const experienceData = Array.isArray(data) ? data : [];
  
  const updateField = (index, field, value) => {
    const newData = [...experienceData];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate(index, newData[index]);
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h2>
        </div>
        <button onClick={onAdd} className="btn-secondary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>
      <div className="space-y-6">
        {experienceData.map((experience, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company *</label>
                <input
                  type="text"
                  value={experience.company || ''}
                  onChange={(e) => updateField(index, 'company', e.target.value)}
                  className="input-field"
                  placeholder="Company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position *</label>
                <input
                  type="text"
                  value={experience.position || ''}
                  onChange={(e) => updateField(index, 'position', e.target.value)}
                  className="input-field"
                  placeholder="Job title"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={experience.startDate || ''}
                  onChange={(e) => updateField(index, 'startDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={experience.endDate || ''}
                  onChange={(e) => updateField(index, 'endDate', e.target.value)}
                  className="input-field"
                  disabled={experience.current}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={experience.current || false}
                  onChange={(e) => updateField(index, 'current', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={`current-${index}`} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Position
                </label>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
              <textarea
                value={experience.description || ''}
                onChange={(e) => updateField(index, 'description', e.target.value)}
                className="input-field min-h-[120px] resize-y"
                placeholder="Describe your responsibilities, achievements, and key contributions..."
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Tip: Use bullet points and action verbs. Focus on quantifiable achievements when possible.
              </p>
            </div>
            {experienceData.length > 1 && (
              <button
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-4"
                aria-label="Remove experience entry"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Remove Experience
              </button>
            )}
          </div>
        ))}
      </div>
      
      {experienceData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium mb-2">No work experience added yet</p>
          <p className="text-sm">Add your work experience to showcase your professional background.</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
