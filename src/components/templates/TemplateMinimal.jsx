import React from 'react';

const TemplateMinimal = ({ data }) => {
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
      {/* Header - Minimal */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {data.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-600 space-y-1 text-sm">
          {data.email && <p>{data.email}</p>}
          {data.phone && <p>{data.phone}</p>}
          {data.location && <p>{data.location}</p>}
          <div className="flex justify-center space-x-4 mt-2">
            {data.linkedin && (
              <span className="text-gray-600">LinkedIn: {data.linkedin}</span>
            )}
            {data.website && (
              <span className="text-gray-600">Website: {data.website}</span>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 uppercase tracking-wide">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-gray-600 text-sm">
                    {formatExperienceDate(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  {exp.company}
                </p>
                <div className="text-gray-700 leading-relaxed text-sm">
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
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-gray-600 text-sm">
                    {edu.graduationDate ? formatDate(edu.graduationDate) : ''}
                  </span>
                </div>
                <p className="text-gray-700 mb-1">
                  {edu.institution}
                </p>
                {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                {edu.achievements && (
                  <p className="text-gray-700 text-sm">
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
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Skills
          </h2>
          <div className="space-y-3">
            {data.skills.technical && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Technical:</h3>
                <p className="text-gray-700 text-sm">{data.skills.technical}</p>
              </div>
            )}
            {data.skills.soft && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Soft Skills:</h3>
                <p className="text-gray-700 text-sm">{data.skills.soft}</p>
              </div>
            )}
            {data.skills.languages && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Languages:</h3>
                <p className="text-gray-700 text-sm">{data.skills.languages}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a href={project.link} className="text-gray-600 text-sm">
                      Link
                    </a>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-sm mb-1">
                    <strong>Tech:</strong> {project.technologies}
                  </p>
                )}
                <p className="text-gray-700 text-sm">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
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
                    <a href={cert.link} className="text-gray-600">
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

export default TemplateMinimal;
