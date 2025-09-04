import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const PersonalInfoSection = ({ data, onUpdate }) => {
  const updateField = (field, value) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="section-card">
      <div className="flex items-center space-x-2 mb-6">
        <User className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => updateField('fullName', e.target.value)}
            className="input-field"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="input-field pl-10"
              placeholder="john.doe@email.com"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="input-field pl-10"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              className="input-field pl-10"
              placeholder="City, State"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn
          </label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={data.linkedin || ''}
              onChange={(e) => updateField('linkedin', e.target.value)}
              className="input-field pl-10"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={data.website || ''}
              onChange={(e) => updateField('website', e.target.value)}
              className="input-field pl-10"
              placeholder="johndoe.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
