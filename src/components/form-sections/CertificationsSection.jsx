import React from 'react';
import { Award, Plus, Trash2, Calendar, Link as LinkIcon } from 'lucide-react';

const CertificationsSection = ({ data, onUpdate, onAdd, onRemove }) => {
  // Ensure data is always an array
  const certificationsData = Array.isArray(data) ? data : [];
  
  const updateField = (index, field, value) => {
    const updatedItem = { ...certificationsData[index], [field]: value };
    onUpdate(index, updatedItem);
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Award className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Certifications
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="space-y-6">
        {certificationsData.map((certification, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Certification #{index + 1}
              </h3>
              {certificationsData.length > 1 && (
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  aria-label="Remove certification entry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Certification Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={certification.name || ''}
                  onChange={(e) => updateField(index, 'name', e.target.value)}
                  className="input-field"
                  placeholder="AWS Certified Solutions Architect, PMP, etc."
                  required
                />
              </div>

              {/* Issuing Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={certification.issuer || ''}
                  onChange={(e) => updateField(index, 'issuer', e.target.value)}
                  className="input-field"
                  placeholder="Amazon Web Services, PMI, Microsoft, etc."
                  required
                />
              </div>

              {/* Date Earned */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Earned
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="month"
                    value={certification.date || ''}
                    onChange={(e) => updateField(index, 'date', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Certification Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Link
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={certification.link || ''}
                    onChange={(e) => updateField(index, 'link', e.target.value)}
                    className="input-field pl-10"
                    placeholder="https://verify.credly.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {certificationsData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium mb-2">No certifications added yet</p>
          <p className="text-sm">Add your professional certifications to demonstrate your expertise and commitment to learning.</p>
        </div>
      )}
    </div>
  );
};

export default CertificationsSection;
