import React from 'react';
import { FolderOpen, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

const ProjectsSection = ({ data, onUpdate, onAdd, onRemove }) => {
  // Ensure data is always an array
  const projectsData = Array.isArray(data) ? data : [];
  
  const updateField = (index, field, value) => {
    const updatedItem = { ...projectsData[index], [field]: value };
    onUpdate(index, updatedItem);
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Projects
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-6">
        {projectsData.map((project, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Project #{index + 1}
              </h3>
              {projectsData.length > 1 && (
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  aria-label="Remove project entry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={project.name || ''}
                  onChange={(e) => updateField(index, 'name', e.target.value)}
                  className="input-field"
                  placeholder="Project Name"
                  required
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technologies Used
                </label>
                <input
                  type="text"
                  value={project.technologies || ''}
                  onChange={(e) => updateField(index, 'technologies', e.target.value)}
                  className="input-field"
                  placeholder="React, Node.js, MongoDB, AWS..."
                />
              </div>

              {/* Project Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Link
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => updateField(index, 'link', e.target.value)}
                    className="input-field pl-10"
                    placeholder="https://github.com/username/project or https://project-demo.com"
                  />
                </div>
              </div>

              {/* Project Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={project.description || ''}
                  onChange={(e) => updateField(index, 'description', e.target.value)}
                  className="input-field"
                  placeholder="Describe what the project does, your role, key features, and outcomes. Focus on the problem it solves and the impact it had."
                  rows="4"
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Tip: Include the problem it solves, your role, key features, and measurable outcomes.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projectsData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium mb-2">No projects added yet</p>
          <p className="text-sm">Add your projects to showcase your technical skills and experience.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
