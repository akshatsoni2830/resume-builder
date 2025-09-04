// Security Configuration for Resume Builder
const SECURITY_CONFIG = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },

  // Security Headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },

  // Input Validation Rules - Updated for better international support
  validation: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Updated phone regex to handle international numbers with country codes and spaces
    phone: /^[+]?[1-9][\d\s\-()]{7,20}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    name: /^[a-zA-Z\s\-']{2,50}$/,
    maxLength: {
      summary: 500,
      description: 1000,
      skills: 300,
      achievements: 500
    }
  },

  // Rate Limiting (for future backend implementation)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // Sanitization Rules
  sanitization: {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    }
  }
};

// Function to validate input data
export const validateInput = (data, type) => {
  const rules = SECURITY_CONFIG.validation;
  
  switch (type) {
    case 'email':
      return rules.email.test(data);
    case 'phone':
      return rules.phone.test(data);
    case 'url':
      return rules.url.test(data);
    case 'name':
      return rules.name.test(data);
    case 'length':
      return Object.entries(rules.maxLength).every(([key, max]) => {
        if (data[key] && data[key].length > max) {
          return false;
        }
        return true;
      });
    default:
      return true;
  }
};

// Function to sanitize HTML content
export const sanitizeHTML = (html) => {
  // Basic HTML sanitization
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
};

// Function to generate secure random ID
export const generateSecureId = () => {
  return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
};

// Function to escape special characters
export const escapeSpecialChars = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

export default SECURITY_CONFIG;
