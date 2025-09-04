import React from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const EducationSection = ({ data, onUpdate, onAdd, onRemove }) => {
  // Ensure data is always an array
  const educationData = Array.isArray(data) ? data : [];
  
  const updateField = (index, field, value) => {
    const updatedItem = { ...educationData[index], [field]: value };
    onUpdate(index, updatedItem);
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Education
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-6">
        {educationData.map((education, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Education #{index + 1}
              </h3>
              {educationData.length > 1 && (
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  aria-label="Remove education entry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution *
                </label>
                <input
                  type="text"
                  value={education.institution || ''}
                  onChange={(e) => updateField(index, 'institution', e.target.value)}
                  className="input-field"
                  placeholder="University Name"
                  required
                />
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  value={education.degree || ''}
                  onChange={(e) => updateField(index, 'degree', e.target.value)}
                  className="input-field"
                  placeholder="Bachelor's, Master's, etc."
                  required
                />
              </div>

              {/* Field of Study */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  value={education.field || ''}
                  onChange={(e) => updateField(index, 'field', e.target.value)}
                  className="input-field"
                  placeholder="Computer Science, Business, etc."
                  required
                />
              </div>

              {/* Graduation Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Graduation Date
                </label>
                <input
                  type="month"
                  value={education.graduationDate || ''}
                  onChange={(e) => updateField(index, 'graduationDate', e.target.value)}
                  className="input-field"
                  placeholder="2020-05"
                />
              </div>

              {/* GPA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  value={education.gpa || ''}
                  onChange={(e) => updateField(index, 'gpa', e.target.value)}
                  className="input-field"
                  placeholder="3.8/4.0 or 9.2/10"
                />
              </div>

              {/* Achievements */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Achievements & Activities
                </label>
                <textarea
                  value={education.achievements || ''}
                  onChange={(e) => updateField(index, 'achievements', e.target.value)}
                  className="input-field"
                  placeholder="Dean's List, relevant coursework, projects, clubs, honors..."
                  rows="3"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Tip: Include academic achievements, relevant coursework, projects, and extracurricular activities.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {educationData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium mb-2">No education added yet</p>
          <p className="text-sm">Add your educational background to showcase your academic achievements.</p>
        </div>
      )}
    </div>
  );
};

export default EducationSection;
