import React from 'react';
import { FileText } from 'lucide-react';

const SummarySection = ({ data, onUpdate }) => {
  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Professional Summary
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Summary *
        </label>
        <textarea
          value={data || ''}
          onChange={(e) => onUpdate(e.target.value)}
          className="input-field min-h-[120px] resize-y"
          placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career objectives. Keep it concise (2-4 sentences) and focus on what makes you unique."
          required
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Tip: Focus on your key achievements, skills, and what you can bring to potential employers.
        </p>
      </div>
    </div>
  );
};

export default SummarySection;
