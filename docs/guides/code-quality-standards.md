# Code Quality Standards and Implementation Guide

This document outlines the comprehensive code quality standards implemented in the AGENTS.md Educational Platform and serves as a guide for maintaining high-quality code throughout the project.

## Overview

The platform follows modern web development best practices, emphasizing type safety, accessibility, security, and maintainability. This guide covers all implemented improvements and how to maintain these standards.

## API Design and Implementation

### Complete CRUD Operations

All API endpoints now implement complete CRUD operations with proper validation:

```typescript
// Examples API
GET    /api/examples     - Retrieve all examples
GET    /api/examples/:id - Retrieve specific example
POST   /api/examples     - Create new example

// Guides API  
GET    /api/guides       - Retrieve all guides
GET    /api/guides/:id   - Retrieve specific guide
POST   /api/guides       - Create new guide
```

### Input Validation

All endpoints use Zod schemas for robust input validation:

```typescript
// Consistent validation across all endpoints
const validatedData = insertExampleSchema.parse(req.body);
```

### Error Handling

Standardized error responses with proper HTTP status codes:

```typescript
// Validation errors return 400
if (error instanceof ZodError) {
  return res.status(400).json({ 
    message: "Invalid data", 
    errors: error.errors 
  });
}

// Server errors return 500
res.status(500).json({ message: "Internal server error" });
```

### Parameter Validation

Consistent ID validation across all endpoints:

```typescript
const id = parseInt(req.params.id);
if (isNaN(id)) {
  return res.status(400).json({ message: "Invalid ID" });
}
```

## Type Safety

### Replacing Generic Types

All `any[]` types have been replaced with proper interfaces:

```typescript
// Before: any[]
// After: Proper interfaces
interface DocsStructure {
  sections: DocsSection[];
  totalFiles: number;
  totalTutorials: number;
}

interface DocsSection {
  id: string;
  title: string;
  path: string;
  files: DocsFile[];
  subsections: DocsSubsection[];
}
```

### Query Function Implementation

All React Query hooks now include proper queryFn implementations:

```typescript
// Documentation structure query
const { data: docsStructure } = useQuery<DocsStructure>({
  queryKey: ['/api/docs'],
  queryFn: () => fetch('/api/docs').then(res => res.json()),
  staleTime: 300000,
});
```

## Markdown Rendering and Semantic HTML

### React Markdown Integration

Replaced custom markdown parser with industry-standard react-markdown:

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{
    // Proper semantic HTML
    ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
  }}
>
  {content}
</ReactMarkdown>
```

### Benefits

- Proper semantic HTML structure
- Built-in accessibility features
- Syntax highlighting support
- GitHub Flavored Markdown support
- Reduced maintenance overhead

## Accessibility Implementation

### Skip Navigation Links

Skip-to-content links for keyboard users:

```typescript
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
>
  Skip to main content
</a>
```

### ARIA Labels

Comprehensive ARIA labels for interactive elements:

```typescript
// Mobile menu toggle
<Button
  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
>
  {isMobileMenuOpen ? <X /> : <Menu />}
</Button>

// External links
<a
  href="https://github.com/..."
  aria-label="View project on GitHub (opens in new tab)"
  target="_blank"
  rel="noopener noreferrer"
>
  <Github />
</a>
```

### Focus Management

Visible focus states for keyboard navigation:

```typescript
className="focus:ring-2 focus:ring-blue-500 focus:outline-none rounded"
```

### Semantic HTML Structure

- Proper heading hierarchy (h1, h2, h3)
- List elements wrapped in ul/ol containers
- Main content areas marked with `<main id="main-content">`
- Navigation marked with `<nav>` elements

## Security Implementation

### HTTP Security Headers

Helmet middleware for security headers:

```typescript
import helmet from "helmet";

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  } : false, // Disabled in development for Vite compatibility
}));
```

### Rate Limiting

Protection against abuse and DoS attacks:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### Input Sanitization

Request body size limits and validation:

```typescript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
```

### Directory Traversal Protection

Secure file serving with path validation:

```typescript
// Security: ensure the path is within docs directory
const safePath = path.join(process.cwd(), 'docs', filePath);
const normalizedPath = path.normalize(safePath);
const docsPath = path.normalize(path.join(process.cwd(), 'docs'));

if (!normalizedPath.startsWith(docsPath)) {
  return res.status(403).json({ message: "Access denied" });
}
```

## Development Environment Configuration

### CSP for Development

Content Security Policy configured for development compatibility:

```typescript
contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
  // Strict CSP for production
} : false // Disabled in development for Vite hot reload
```

### Error Logging

Comprehensive error logging for debugging:

```typescript
console.error("Error creating example:", error);
```

## Best Practices for Future Development

### API Endpoints

1. Always validate input using Zod schemas
2. Implement consistent error handling
3. Add proper logging for debugging
4. Use appropriate HTTP status codes
5. Validate all path parameters

### Frontend Components

1. Add ARIA labels for interactive elements
2. Implement proper focus management
3. Use semantic HTML elements
4. Include skip navigation for accessibility
5. Test with keyboard navigation

### Type Safety

1. Define explicit interfaces instead of using `any`
2. Use proper TypeScript types throughout
3. Implement proper error handling with type guards
4. Validate data at API boundaries

### Security

1. Validate and sanitize all inputs
2. Use security headers in production
3. Implement rate limiting for APIs
4. Protect against directory traversal
5. Use HTTPS in production

## Testing Guidelines

### Accessibility Testing

1. Test with keyboard navigation only
2. Use screen reader testing tools
3. Verify proper focus management
4. Check color contrast ratios
5. Validate semantic HTML structure

### Security Testing

1. Test rate limiting effectiveness
2. Verify input validation works
3. Check for directory traversal vulnerabilities
4. Validate security headers in production
5. Test CORS configuration

## Maintenance

### Regular Updates

1. Keep dependencies updated
2. Monitor security vulnerabilities
3. Review and update CSP policies
4. Test accessibility regularly
5. Monitor API performance

### Code Reviews

1. Verify accessibility standards
2. Check security implementations
3. Validate type safety
4. Review error handling
5. Test responsive design

This comprehensive implementation ensures the platform meets professional development standards while maintaining excellent user experience and security.