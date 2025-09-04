import React from 'react';

const TemplateCreative = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatExperienceDate = (startDate, endDate, current) => {
    if (!startDate) return '';
    const start = formatDate(startDate);
    if (current) return `${start} - Present`;
    if (!endDate) return start;
    return `${start} - ${formatDate(endDate)}`;
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-sans text-gray-900">
      {/* Header - Creative Style */}
      <header className="relative mb-10">
        <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
        <div className="pl-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {data.fullName || 'Your Name'}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div className="space-y-2">
              {data.email && (
                <p className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="font-medium">{data.email}</span>
                </p>
              )}
              {data.phone && (
                <p className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>{data.phone}</span>
                </p>
              )}
              {data.location && (
                <p className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>{data.location}</span>
                </p>
              )}
            </div>
            <div className="space-y-2">
              {data.linkedin && (
                <p className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-600 font-medium">LinkedIn: {data.linkedin}</span>
                </p>
              )}
              {data.website && (
                <p className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-600 font-medium">Website: {data.website}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-10">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl border-l-4 border-purple-400">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></span>
              Creative Profile
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {data.summary}
            </p>
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></span>
            Professional Journey
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
                <div className="pl-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <span className="text-purple-600 font-semibold text-sm bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                      {formatExperienceDate(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-purple-700 mb-4">
                    {exp.company}
                  </p>
                  <div className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                    {exp.description.split('\n').map((line, i) => (
                      <p key={i} className="mb-3">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && data.education[0].institution && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></span>
            Academic Background
          </h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    {edu.graduationDate ? formatDate(edu.graduationDate) : ''}
                  </span>
                </div>
                <p className="text-xl font-semibold text-blue-700 mb-3">
                  {edu.institution}
                </p>
                {edu.gpa && <p className="text-gray-600 mb-3">GPA: {edu.gpa}</p>}
                {edu.achievements && (
                  <p className="text-gray-700">
                    {edu.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(data.skills?.technical || data.skills?.soft || data.skills?.languages) && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></span>
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.skills.technical && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg border-b border-purple-300 pb-2">Technical Skills</h3>
                <p className="text-gray-700">{data.skills.technical}</p>
              </div>
            )}
            {data.skills.soft && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg border-b border-blue-300 pb-2">Creative Skills</h3>
                <p className="text-gray-700">{data.skills.soft}</p>
              </div>
            )}
            {data.skills.languages && (
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg border-b border-indigo-300 pb-2">Languages</h3>
                <p className="text-gray-700">{data.skills.languages}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></span>
            Creative Portfolio
          </h2>
          <div className="space-y-8">
            {data.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-purple-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a href={project.link} className="text-purple-600 text-sm font-semibold hover:underline bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                      View Project
                    </a>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-sm mb-4 font-medium">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                )}
                <p className="text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></span>
            Professional Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.certifications.map((cert, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border-l-4 border-purple-400">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-900">{cert.name}</span>
                    <span className="text-gray-600 ml-2">- {cert.issuer}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {cert.date && (
                      <span className="text-purple-600 text-sm font-semibold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        {formatDate(cert.date)}
                      </span>
                    )}
                    {cert.link && (
                      <a href={cert.link} className="text-purple-600 text-sm hover:underline">
                        Verify
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateCreative;
