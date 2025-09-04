# ATS Resume Builder

A modern, ATS-friendly resume builder web application built with React and TailwindCSS. Create professional resumes with multiple templates and export them as PDF files optimized for Applicant Tracking Systems.

## ✨ Features

### **Core Features**
- **ATS-Friendly Design**: Clean, text-based layouts that work perfectly with Applicant Tracking Systems
- **Multiple Templates**: Choose from Classic, Modern, Minimal, Corporate, Creative, and Compact designs
- **Real-time Preview**: See changes instantly as you type
- **PDF Export**: Generate professional PDF resumes using react-pdf
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Local Storage**: Your data is automatically saved locally - never lose progress
- **Mobile Responsive**: Works perfectly on all devices
- **Professional Sections**: All essential resume sections included
- **Easy Editing**: Add, remove, and modify any section with intuitive controls

### **Advanced Features** 🚀
- **Prompt-based Input**: Paste your resume text and let AI parse it automatically
- **Smart Resume Enhancer**: AI-powered content improvement with ATS keyword injection
- **PDF Upload & Edit**: Upload existing resumes and edit them
- **Job Description Matcher**: Compare your resume with job descriptions
- **AI Section Writer**: Generate content for any resume section
- **Cover Letter Generator**: Create professional cover letters
- **Resume Scoring**: Get feedback and improvement suggestions


## 🚀 Tech Stack

- **Frontend**: React 18, TailwindCSS
- **PDF Generation**: react-pdf
- **Icons**: Lucide React
- **Styling**: TailwindCSS with custom components
- **Storage**: LocalStorage (no database required)

## 📋 Resume Sections

- **Personal Information**: Name, contact details, location, social links
- **Professional Summary**: Compelling career overview
- **Work Experience**: Job history with descriptions and dates
- **Education**: Academic background, degrees, and achievements
- **Skills**: Technical, soft skills, and languages
- **Projects**: Portfolio projects with technologies and descriptions
- **Certifications**: Professional certifications and credentials

## 🎨 Templates

### Classic Template
- Traditional professional layout
- Clean borders and structured sections
- Perfect for corporate environments

### Modern Template
- Contemporary design with accent colors
- Card-based layout with visual hierarchy
- Great for creative and tech industries

### Minimal Template
- Simple, focused design
- Maximum readability
- Ideal for ATS optimization

### Corporate Template
- Formal and structured layout
- Emphasizes work history and experience
- Perfect for traditional industries

### Creative Template
- Clean typography with subtle color accents
- Stylish but ATS-friendly design
- Great for creative and design roles

### Compact Template
- Single-page, tightly packed layout
- Optimized for quick scanning
- Ideal for experienced professionals



## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd ats-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment.

## 📱 Usage Guide

### Creating Your Resume

1. **Fill in Personal Information**
   - Enter your name, email, phone, and location
   - Add LinkedIn and website links if available

2. **Write Your Summary**
   - Craft a compelling 2-4 sentence professional summary
   - Focus on your key strengths and career objectives

3. **Add Work Experience**
   - Click "Add Experience" for each job
   - Include company name, position, dates, and detailed descriptions
   - Use action verbs and quantify achievements when possible

4. **List Your Education**
   - Add your degrees, institutions, and graduation dates
   - Include GPA and relevant achievements

5. **Showcase Your Skills**
   - Technical skills (programming languages, tools, technologies)
   - Soft skills (leadership, communication, problem-solving)
   - Languages you speak

6. **Highlight Projects**
   - Describe your portfolio projects
   - Include technologies used and project links
   - Focus on problem-solving and outcomes

7. **Add Certifications**
   - List professional certifications
   - Include issuing organizations and dates
   - Add verification links when available

### Preview and Export

1. **Switch to Preview Mode**
   - Click the "Preview" button to see your resume
   - Choose different templates using the template selector

2. **Export as PDF**
   - Click "Export PDF" to generate your resume
   - The PDF is optimized for ATS systems
   - File will be automatically downloaded

### Template Switching

- Use the template selector in the header to switch between designs
- All templates are ATS-friendly and maintain the same content structure
- Preview changes instantly without losing your data

## 🎯 ATS Optimization Tips

### Content Best Practices
- Use industry-standard job titles and keywords
- Include specific skills mentioned in job descriptions
- Quantify achievements with numbers and percentages
- Use clear, concise language

### Formatting Guidelines
- Stick to standard fonts (Arial, Calibri, Times New Roman)
- Avoid graphics, images, and complex layouts
- Use clear section headings
- Maintain consistent formatting throughout

### Keywords
- Research job descriptions for relevant keywords
- Include technical skills, certifications, and industry terms
- Use variations of important terms
- Avoid overstuffing - keep it natural

## 🔧 Customization

### Adding New Templates
1. Create a new template component in `src/components/templates/`
2. Follow the existing template structure
3. Add the template to the `TemplateSelector` component
4. Update the `ResumePreview` component to include your template

### Modifying Styles
- Edit `src/index.css` for global styles
- Modify `tailwind.config.js` for theme customization
- Update individual component styles as needed

### Adding New Sections
1. Create a new form section component
2. Add it to the `ResumeForm` component
3. Update the resume data structure in `App.jsx`
4. Include the section in all template components

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

### Vercel
1. Import your GitHub repository
2. Framework preset: Create React App
3. Build command: `npm run build`
4. Output directory: `build`

### Other Platforms
- Build the project: `npm run build`
- Upload the `build/` folder contents
- Configure for single-page application routing

## 📁 Project Structure

```
src/
├── components/
│   ├── form-sections/          # Form input components
│   │   ├── PersonalInfoSection.jsx
│   │   ├── SummarySection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── SkillsSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   └── CertificationsSection.jsx
│   ├── templates/              # Resume template components
│   │   ├── TemplateClassic.jsx
│   │   ├── TemplateModern.jsx
│   │   └── TemplateMinimal.jsx
│   ├── ResumeForm.jsx          # Main form component
│   ├── ResumePreview.jsx       # Preview component
│   ├── ExportButton.jsx        # PDF export functionality
│   ├── ThemeToggle.jsx         # Dark/light mode toggle
│   └── TemplateSelector.jsx    # Template selection
├── App.jsx                     # Main application component
├── index.js                    # React entry point
└── index.css                   # Global styles and TailwindCSS
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure all dependencies are properly installed
3. Verify Node.js version compatibility
4. Create an issue in the repository

## 🔮 Future Enhancements

- Additional resume templates
- Resume sharing and collaboration
- Integration with job boards
- Resume analytics and optimization suggestions
- Multiple language support
- Advanced formatting options

---

**Happy Resume Building! 🎉**

Create professional, ATS-friendly resumes that will help you stand out in your job search.
