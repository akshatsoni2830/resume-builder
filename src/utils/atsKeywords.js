// ATS Keywords for Resume Enhancement
// This file contains industry-specific keywords that Applicant Tracking Systems look for

export const ATS_KEYWORDS = {
  // Core Technical Skills
  programmingLanguages: [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "PHP", "Ruby", "Go", "Rust",
    "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Shell Scripting", "PowerShell"
  ],
  
  webTechnologies: [
    "HTML5", "CSS3", "Sass/SCSS", "React.js", "Vue.js", "Angular", "Node.js", "Express.js",
    "Next.js", "Nuxt.js", "jQuery", "Bootstrap", "Tailwind CSS", "Material-UI", "Ant Design",
    "GraphQL", "REST APIs", "WebSockets", "Progressive Web Apps (PWA)", "Single Page Applications (SPA)"
  ],
  
  databases: [
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "DynamoDB",
    "Cassandra", "Elasticsearch", "Neo4j", "Firebase", "Supabase", "Database Design", "Data Modeling",
    "SQL Optimization", "NoSQL", "Database Administration", "Data Migration"
  ],
  
  cloudPlatforms: [
    "AWS (Amazon Web Services)", "Azure", "Google Cloud Platform (GCP)", "DigitalOcean", "Heroku",
    "Vercel", "Netlify", "Cloudflare", "IBM Cloud", "Oracle Cloud", "Serverless Computing",
    "Lambda Functions", "Cloud Storage", "Load Balancing", "Auto-scaling", "Cloud Security"
  ],
  
  devopsTools: [
    "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "GitHub Actions", "Travis CI", "CircleCI",
    "Ansible", "Terraform", "Chef", "Puppet", "Prometheus", "Grafana", "ELK Stack", "Splunk",
    "Infrastructure as Code (IaC)", "Continuous Integration/Continuous Deployment (CI/CD)"
  ],
  
  versionControl: [
    "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Version Control", "Branch Management",
    "Code Review", "Pull Requests", "Merge Conflicts", "Git Flow", "Feature Branches"
  ],
  
  // Soft Skills & Professional Competencies
  softSkills: [
    "Problem Solving", "Critical Thinking", "Analytical Skills", "Team Collaboration", "Leadership",
    "Communication", "Time Management", "Project Management", "Adaptability", "Fast Learning",
    "Attention to Detail", "Creativity", "Innovation", "Strategic Planning", "Decision Making",
    "Conflict Resolution", "Mentoring", "Cross-functional Collaboration", "Client Communication"
  ],
  
  methodologies: [
    "Agile Development", "Scrum", "Kanban", "Waterfall", "DevOps", "Lean Development",
    "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)", "Extreme Programming (XP)",
    "Software Development Lifecycle (SDLC)", "Rapid Application Development (RAD)"
  ],
  
  // AI/ML & Data Science
  aiMl: [
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "Neural Networks", "TensorFlow",
    "PyTorch", "Scikit-learn", "Keras", "Natural Language Processing (NLP)", "Computer Vision",
    "Data Mining", "Predictive Analytics", "Statistical Analysis", "Data Visualization",
    "Big Data", "Hadoop", "Spark", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau"
  ],
  
  // Cybersecurity
  cybersecurity: [
    "Cybersecurity", "Information Security", "Penetration Testing", "Vulnerability Assessment",
    "Security Auditing", "Firewall Management", "Intrusion Detection Systems (IDS)", "SIEM",
    "Ethical Hacking", "Security Compliance", "GDPR", "HIPAA", "SOC 2", "ISO 27001",
    "Network Security", "Application Security", "Data Encryption", "Access Control", "Identity Management"
  ],
  
  // Testing & Quality Assurance
  testing: [
    "Unit Testing", "Integration Testing", "End-to-End Testing", "Automated Testing", "Manual Testing",
    "Test Automation", "Selenium", "Jest", "Mocha", "Cypress", "Playwright", "JUnit", "PyTest",
    "Quality Assurance (QA)", "Test Planning", "Bug Tracking", "Performance Testing", "Load Testing",
    "Security Testing", "User Acceptance Testing (UAT)"
  ],
  
  // Mobile Development
  mobileDev: [
    "React Native", "Flutter", "iOS Development", "Android Development", "Swift", "Kotlin",
    "Mobile App Development", "Cross-platform Development", "App Store Optimization (ASO)",
    "Mobile UI/UX", "Push Notifications", "Mobile Security", "Mobile Testing"
  ],
  
  // System Design & Architecture
  systemDesign: [
    "System Design", "Software Architecture", "Microservices", "Monolithic Architecture",
    "Distributed Systems", "Scalability", "High Availability", "Fault Tolerance", "Load Balancing",
    "Caching Strategies", "Message Queues", "Event-Driven Architecture", "API Design",
    "Performance Optimization", "Code Optimization", "Memory Management", "Garbage Collection"
  ]
};

// Function to get relevant keywords based on input text
export const getRelevantKeywords = (inputText) => {
  const relevantKeywords = [];
  const lowerText = inputText.toLowerCase();
  
  // Check for programming languages and add related skills
  if (lowerText.includes('python')) {
    relevantKeywords.push(...ATS_KEYWORDS.aiMl.slice(0, 5));
    relevantKeywords.push(...ATS_KEYWORDS.programmingLanguages.filter(lang => 
      ['python', 'r', 'matlab'].includes(lang.toLowerCase())
    ));
    relevantKeywords.push('Data Structures & Algorithms', 'Object-Oriented Programming (OOP)');
  }
  
  if (lowerText.includes('react') || lowerText.includes('javascript')) {
    relevantKeywords.push(...ATS_KEYWORDS.webTechnologies.slice(0, 8));
    relevantKeywords.push('Responsive Web Design', 'Cross-Browser Compatibility');
  }
  
  if (lowerText.includes('java') || lowerText.includes('c++')) {
    relevantKeywords.push('Data Structures & Algorithms', 'Object-Oriented Programming (OOP)');
    relevantKeywords.push('System Design', 'Performance Optimization');
  }
  
  if (lowerText.includes('cybersecurity') || lowerText.includes('security')) {
    relevantKeywords.push(...ATS_KEYWORDS.cybersecurity.slice(0, 10));
  }
  
  if (lowerText.includes('ai') || lowerText.includes('machine learning')) {
    relevantKeywords.push(...ATS_KEYWORDS.aiMl.slice(0, 8));
  }
  
  if (lowerText.includes('web') || lowerText.includes('frontend')) {
    relevantKeywords.push(...ATS_KEYWORDS.webTechnologies.slice(0, 12));
    relevantKeywords.push('UI/UX Design', 'User Experience');
  }
  
  if (lowerText.includes('database') || lowerText.includes('sql')) {
    relevantKeywords.push(...ATS_KEYWORDS.databases.slice(0, 8));
  }
  
  // Always add core soft skills
  relevantKeywords.push(...ATS_KEYWORDS.softSkills.slice(0, 8));
  relevantKeywords.push(...ATS_KEYWORDS.methodologies.slice(0, 5));
  
  // Remove duplicates and return
  return [...new Set(relevantKeywords)];
};

// Function to get industry-specific keywords
export const getIndustryKeywords = (industry) => {
  const industryMap = {
    'web-development': [...ATS_KEYWORDS.webTechnologies, ...ATS_KEYWORDS.databases, ...ATS_KEYWORDS.devopsTools],
    'ai-ml': [...ATS_KEYWORDS.aiMl, ...ATS_KEYWORDS.programmingLanguages.slice(0, 5)],
    'cybersecurity': [...ATS_KEYWORDS.cybersecurity, ...ATS_KEYWORDS.systemDesign.slice(0, 5)],
    'mobile-development': [...ATS_KEYWORDS.mobileDev, ...ATS_KEYWORDS.programmingLanguages.slice(5, 10)],
    'data-science': [...ATS_KEYWORDS.aiMl, ...ATS_KEYWORDS.databases, ...ATS_KEYWORDS.programmingLanguages.slice(0, 5)],
    'devops': [...ATS_KEYWORDS.devopsTools, ...ATS_KEYWORDS.cloudPlatforms, ...ATS_KEYWORDS.versionControl]
  };
  
  return industryMap[industry] || ATS_KEYWORDS.programmingLanguages;
};

export default ATS_KEYWORDS;
