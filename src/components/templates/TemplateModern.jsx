import React from 'react';

const TemplateModern = ({ data }) => {
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
      {/* Header with accent bar */}
      <header className="relative mb-8">
        <div className="absolute left-0 top-0 w-1 h-full bg-primary-600"></div>
        <div className="pl-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {data.fullName || 'Your Name'}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div className="space-y-1">
              {data.email && <p className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>{data.email}</p>}
              {data.phone && <p className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>{data.phone}</p>}
              {data.location && <p className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>{data.location}</p>}
            </div>
            <div className="space-y-1">
              {data.linkedin && <p className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>LinkedIn: {data.linkedin}</p>}
              {data.website && <p className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>Website: {data.website}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-3 h-3 bg-primary-600 rounded-full mr-3"></span>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {data.summary}
            </p>
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-4 h-4 bg-primary-600 rounded-full mr-4"></span>
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-primary-200 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1 rounded-full">
                    {formatExperienceDate(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-lg font-semibold text-primary-700 mb-3">
                  {exp.company}
                </p>
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {exp.description.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && data.education[0].institution && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-4 h-4 bg-primary-600 rounded-full mr-4"></span>
            Education
          </h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1 rounded-full">
                    {edu.graduationDate ? formatDate(edu.graduationDate) : ''}
                  </span>
                </div>
                <p className="text-lg font-semibold text-primary-700 mb-3">
                  {edu.institution}
                </p>
                {edu.gpa && <p className="text-gray-600 mb-2">GPA: {edu.gpa}</p>}
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
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-4 h-4 bg-primary-600 rounded-full mr-4"></span>
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.skills.technical && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Technical Skills</h3>
                <p className="text-gray-700">{data.skills.technical}</p>
              </div>
            )}
            {data.skills.soft && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Soft Skills</h3>
                <p className="text-gray-700">{data.skills.soft}</p>
              </div>
            )}
            {data.skills.languages && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Languages</h3>
                <p className="text-gray-700">{data.skills.languages}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-4 h-4 bg-primary-600 rounded-full mr-4"></span>
            Projects
          </h2>
          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a href={project.link} className="text-primary-600 text-sm font-semibold hover:underline bg-primary-50 px-3 py-1 rounded-full">
                      View Project
                    </a>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-sm mb-3 font-medium">
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
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-4 h-4 bg-primary-600 rounded-full mr-4"></span>
            Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-400">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-900">{cert.name}</span>
                    <span className="text-gray-600 ml-2">- {cert.issuer}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {cert.date && (
                      <span className="text-primary-600 text-sm font-semibold bg-primary-50 px-2 py-1 rounded-full">
                        {formatDate(cert.date)}
                      </span>
                    )}
                    {cert.link && (
                      <a href={cert.link} className="text-primary-600 text-sm hover:underline">
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

export default TemplateModern;
