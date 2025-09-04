import React from 'react';
import { Zap } from 'lucide-react';

const SkillsSection = ({ data, onUpdate }) => {
  const updateSkill = (key, value) => {
    onUpdate(key, value);
  };

  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Skills & Languages
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Technical Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technical Skills
          </label>
          <textarea
            value={data.technical || ''}
            onChange={(e) => updateSkill('technical', e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git..."
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            List your technical skills, programming languages, tools, and technologies.
          </p>
        </div>

        {/* Soft Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Soft Skills
          </label>
          <textarea
            value={data.soft || ''}
            onChange={(e) => updateSkill('soft', e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="Leadership, Communication, Problem-solving, Teamwork, Time Management..."
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Include interpersonal skills, leadership abilities, and personal qualities.
          </p>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Languages
          </label>
          <textarea
            value={data.languages || ''}
            onChange={(e) => updateSkill('languages', e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="English (Native), Spanish (Fluent), French (Intermediate)..."
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            List languages you speak and your proficiency level.
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Skills Tips
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Be specific about your skill levels (Beginner, Intermediate, Advanced, Expert)</li>
          <li>• Include skills that are relevant to the job you're applying for</li>
          <li>• Use industry-standard terminology and keywords for ATS compatibility</li>
          <li>• Consider grouping skills by category for better organization</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsSection;
