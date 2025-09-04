import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';

const ExportButton = ({ resumeData, template }) => {
  const [isExporting, setIsExporting] = useState(false);

  // ATS-friendly PDF styles - clean and simple for all templates
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily: 'Helvetica',
      lineHeight: 1.4,
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
      borderBottom: '2px solid #333',
      paddingBottom: 15,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#000',
    },
    contactInfo: {
      fontSize: 10,
      marginBottom: 4,
      color: '#333',
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#000',
      borderBottom: '1px solid #ccc',
      paddingBottom: 4,
    },
    subsection: {
      marginBottom: 10,
    },
    title: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#000',
    },
    subtitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#333',
    },
    description: {
      fontSize: 9,
      marginBottom: 4,
      color: '#333',
      textAlign: 'justify',
    },
    date: {
      fontSize: 9,
      color: '#666',
      fontStyle: 'italic',
    },
    skillsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    skillsColumn: {
      width: '30%',
    },
    skillsTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#000',
    },
    skillsText: {
      fontSize: 9,
      color: '#333',
    },
  });

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

  // PDF Document component - ATS-friendly layout
  const PDFDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resumeData.fullName || 'Your Name'}</Text>
          {resumeData.email && <Text style={styles.contactInfo}>{resumeData.email}</Text>}
          {resumeData.phone && <Text style={styles.contactInfo}>{resumeData.phone}</Text>}
          {resumeData.location && <Text style={styles.contactInfo}>{resumeData.location}</Text>}
          {(resumeData.linkedin || resumeData.website) && (
            <Text style={styles.contactInfo}>
              {resumeData.linkedin && `LinkedIn: ${resumeData.linkedin}`}
              {resumeData.linkedin && resumeData.website && ' | '}
              {resumeData.website && `Website: ${resumeData.website}`}
            </Text>
          )}
        </View>

        {/* Professional Summary */}
        {resumeData.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.description}>{resumeData.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0].company && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {resumeData.experience.map((exp, index) => (
              <View key={index} style={styles.subsection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={styles.title}>{exp.position}</Text>
                  <Text style={styles.date}>{formatExperienceDate(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                <Text style={styles.subtitle}>{exp.company}</Text>
                <Text style={styles.description}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && resumeData.education[0].institution && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {resumeData.education.map((edu, index) => (
              <View key={index} style={styles.subsection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={styles.title}>{edu.degree} in {edu.field}</Text>
                  <Text style={styles.date}>{edu.graduationDate ? formatDate(edu.graduationDate) : ''}</Text>
                </View>
                <Text style={styles.subtitle}>{edu.institution}</Text>
                {edu.gpa && <Text style={styles.description}>GPA: {edu.gpa}</Text>}
                {edu.achievements && <Text style={styles.description}>{edu.achievements}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {(resumeData.skills?.technical || resumeData.skills?.soft || resumeData.skills?.languages) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS & EXPERTISE</Text>
            <View style={styles.skillsGrid}>
              {resumeData.skills.technical && (
                <View style={styles.skillsColumn}>
                  <Text style={styles.skillsTitle}>Technical Skills</Text>
                  <Text style={styles.skillsText}>{resumeData.skills.technical}</Text>
                </View>
              )}
              {resumeData.skills.soft && (
                <View style={styles.skillsColumn}>
                  <Text style={styles.skillsTitle}>Soft Skills</Text>
                  <Text style={styles.skillsText}>{resumeData.skills.soft}</Text>
                </View>
              )}
              {resumeData.skills.languages && (
                <View style={styles.skillsColumn}>
                  <Text style={styles.skillsTitle}>Languages</Text>
                  <Text style={styles.skillsText}>{resumeData.skills.languages}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0].name && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KEY PROJECTS</Text>
            {resumeData.projects.map((project, index) => (
              <View key={index} style={styles.subsection}>
                <Text style={styles.title}>{project.name}</Text>
                {project.technologies && <Text style={styles.subtitle}>Technologies: {project.technologies}</Text>}
                <Text style={styles.description}>{project.description}</Text>
                {project.link && <Text style={styles.description}>Link: {project.link}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL CERTIFICATIONS</Text>
            {resumeData.certifications.map((cert, index) => (
              <View key={index} style={styles.subsection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={styles.title}>{cert.name} - {cert.issuer}</Text>
                  {cert.date && <Text style={styles.date}>{formatDate(cert.date)}</Text>}
                </View>
                {cert.link && <Text style={styles.description}>Verification: {cert.link}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await pdf(<PDFDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.fullName || 'Resume'}_${template.charAt(0).toUpperCase() + template.slice(1)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={isExporting} className="btn-primary flex items-center space-x-2">
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </>
      )}
    </button>
  );
};

export default ExportButton;
