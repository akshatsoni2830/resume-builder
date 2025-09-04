import React from 'react';

const TemplateCompact = ({ data }) => {
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
    <div className="bg-white p-6 max-w-4xl mx-auto font-sans text-gray-900 text-sm">
      {/* Header - Compact Style */}
      <header className="text-center border-b-2 border-gray-400 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {data.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-600 text-sm space-y-1">
          {data.email && <p>{data.email}</p>}
          {data.phone && <p>{data.phone}</p>}
          {data.location && <p>{data.location}</p>}
          <div className="flex justify-center space-x-4 mt-2">
            {data.linkedin && (
              <span className="text-blue-600">LinkedIn: {data.linkedin}</span>
            )}
            {data.website && (
              <span className="text-blue-600">Website: {data.website}</span>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">
            Summary
          </h2>
          <p className="text-gray-700 leading-tight">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">
            Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-gray-600 text-xs">
                    {formatExperienceDate(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="font-medium text-gray-700 mb-1 text-sm">
                  {exp.company}
                </p>
                <div className="text-gray-700 leading-tight text-xs">
                  {exp.description.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && data.education[0].institution && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-gray-600 text-xs">
                    {edu.graduationDate ? formatDate(edu.graduationDate) : ''}
                  </span>
                </div>
                <p className="font-medium text-gray-700 mb-1 text-sm">
                  {edu.institution}
                </p>
                {edu.gpa && <p className="text-gray-600 text-xs mb-1">GPA: {edu.gpa}</p>}
                {edu.achievements && (
                  <p className="text-gray-700 text-xs">
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
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.skills.technical && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Technical:</h3>
                <p className="text-gray-700 text-xs">{data.skills.technical}</p>
              </div>
            )}
            {data.skills.soft && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Soft Skills:</h3>
                <p className="text-gray-700 text-xs">{data.skills.soft}</p>
              </div>
            )}
            {data.skills.languages && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Languages:</h3>
                <p className="text-gray-700 text-xs">{data.skills.languages}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-2">
            {data.projects.map((project, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a href={project.link} className="text-blue-600 text-xs hover:underline">
                      Link
                    </a>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-xs mb-1">
                    <strong>Tech:</strong> {project.technologies}
                  </p>
                )}
                <p className="text-gray-700 text-xs">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">
            Certifications
          </h2>
          <div className="space-y-1">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                  <span className="text-gray-600 ml-2">- {cert.issuer}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {cert.date && (
                    <span className="text-gray-600">
                      {formatDate(cert.date)}
                    </span>
                  )}
                  {cert.link && (
                    <a href={cert.link} className="text-blue-600 hover:underline">
                      Verify
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateCompact;
