import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

const InputModeToggle = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onModeChange('form')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentMode === 'form'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Form Mode</span>
      </button>
      
      <button
        onClick={() => onModeChange('prompt')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentMode === 'prompt'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>Prompt Mode</span>
      </button>
    </div>
  );
};

export default InputModeToggle;
