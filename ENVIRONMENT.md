# Environment Variables for Resume Builder

This document outlines the environment variables needed for the Resume Builder application.

## Client-Side Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# App Configuration
REACT_APP_APP_NAME=Resume Builder
REACT_APP_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_AI_FEATURES=true
REACT_APP_ENABLE_JOB_MATCHING=true
REACT_APP_ENABLE_RESUME_SCORING=true
REACT_APP_ENABLE_COVER_LETTER=true
REACT_APP_ENABLE_PDF_UPLOAD=true

# API Configuration (for future backend features)
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_USE_SERVERLESS=false

# Analytics (optional)
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_SENTRY_DSN=

# Security
REACT_APP_ENABLE_HTTPS_ONLY=true
REACT_APP_CONTENT_SECURITY_POLICY=true
```

## Server-Side Environment Variables (for Vercel deployment)

When deploying to Vercel, add these environment variables in your Vercel dashboard:

```bash
# App Configuration
NODE_ENV=production
APP_NAME=Resume Builder
APP_VERSION=1.0.0

# Security
ENABLE_HTTPS_ONLY=true
CONTENT_SECURITY_POLICY=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Future API Features
API_SECRET_KEY=your-secret-key-here
```

## Local Development Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the required values
3. Restart your development server

## Production Deployment

1. Set environment variables in your hosting platform
2. Ensure all security-related variables are properly configured
3. Test the application thoroughly before going live

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique values for production
- Regularly rotate sensitive credentials
- Monitor for security vulnerabilities
