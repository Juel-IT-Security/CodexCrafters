# AGENTS.md Educational Platform Documentation

A comprehensive learning platform for multi-agent development with AI-powered AGENTS.md file generation, developed by the **Juel Foundation of Self Learning, Inc.** This documentation covers the complete implementation, code quality standards, and best practices.

## Table of Contents

- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [Code Quality Standards](#code-quality-standards)
- [Security Implementation](#security-implementation)
- [Accessibility Features](#accessibility-features)
- [API Documentation](#api-documentation)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

## Getting Started

### Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Visit `http://localhost:5000`

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- TypeScript knowledge
- Basic understanding of React and Express.js

## Architecture Overview

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: Zod schemas
- **Security**: Helmet, rate limiting
- **Accessibility**: WCAG 2.1 AA compliance

### Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/               # Express backend
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data layer abstraction
│   └── index.ts          # Server setup
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database and validation schemas
└── docs/                 # Documentation
    ├── guides/           # Implementation guides
    └── tutorials/        # Step-by-step tutorials
```

## Code Quality Standards

### Type Safety

All code uses strict TypeScript with proper type definitions:

- **No `any` types** - All data structures use explicit interfaces
- **Zod validation** - Runtime type checking for API boundaries
- **Drizzle ORM** - Type-safe database operations
- **Proper error handling** - Type-safe error boundaries

### API Design

Complete CRUD operations with robust validation:

```typescript
// All endpoints follow consistent patterns
GET    /api/examples     - List resources
GET    /api/examples/:id - Get single resource  
POST   /api/examples     - Create resource
PUT    /api/examples/:id - Update resource
DELETE /api/examples/:id - Delete resource
```

### Validation Standards

- **Input validation** using Zod schemas
- **Parameter validation** for all route parameters
- **Error standardization** with consistent response format
- **Request limits** to prevent abuse

### Documentation Requirements

- **Comprehensive comments** explaining business logic
- **Type definitions** for all data structures  
- **API documentation** with examples
- **Accessibility guidelines** for UI components

## Security Implementation

### HTTP Security Headers

Helmet middleware provides essential security headers:

- **Content Security Policy** - Prevents XSS attacks
- **X-Frame-Options** - Prevents clickjacking
- **HSTS** - Enforces HTTPS connections
- **X-Content-Type-Options** - Prevents MIME sniffing

### Rate Limiting

Protection against abuse and DoS attacks:

- **API rate limiting** - 100 requests per 15 minutes
- **Configurable limits** for different endpoint types
- **IP-based tracking** with proper headers

### Input Protection

- **Request size limits** - Prevents large payload attacks
- **Path validation** - Prevents directory traversal
- **Schema validation** - Rejects malformed data
- **SQL injection prevention** - Parameterized queries only

### Development vs Production

Security configurations adapt to environment:

- **Development** - Relaxed CSP for hot reload
- **Production** - Strict security headers
- **Environment-specific** rate limits and validation

## Accessibility Features

### WCAG 2.1 AA Compliance

Complete accessibility implementation:

- **Skip navigation** links for keyboard users
- **ARIA labels** for all interactive elements
- **Semantic HTML** structure throughout
- **Focus management** with visible indicators
- **Screen reader** optimization

### Keyboard Navigation

- **Tab order** follows logical flow
- **Escape key** closes modals and menus
- **Arrow keys** for menu navigation
- **Enter/Space** activates buttons

### Visual Accessibility

- **High contrast** color schemes
- **Sufficient color contrast** ratios (4.5:1+)
- **Scalable text** up to 200%
- **Color independence** - no color-only information

### Interactive Elements

- **Touch targets** minimum 44px × 44px
- **External link** indicators with context
- **Form validation** with clear error messages
- **Loading states** with progress indication

## API Documentation

### Examples Endpoints

```typescript
// Get all examples
GET /api/examples
Response: Example[]

// Get specific example
GET /api/examples/:id
Response: Example | 404

// Create new example
POST /api/examples
Body: InsertExample
Response: Example | 400 | 500
```

### Guides Endpoints

```typescript
// Get all guides  
GET /api/guides
Response: Guide[]

// Get specific guide
GET /api/guides/:id  
Response: Guide | 404

// Create new guide
POST /api/guides
Body: InsertGuide
Response: Guide | 400 | 500
```

### Documentation Endpoints

```typescript
// Get documentation structure
GET /api/docs
Response: DocsStructure

// Get file content
GET /api/docs/content?path=file.md
Response: { content: string, path: string }
```

### Error Responses

Standardized error format:

```typescript
{
  message: string,
  code?: string,
  errors?: ValidationError[],
  timestamp: string
}
```

## Development Guidelines

### Code Standards

- **ESLint configuration** for consistent formatting
- **TypeScript strict mode** enabled
- **Prettier formatting** for code consistency
- **Git hooks** for pre-commit validation

### Component Guidelines

- **Single responsibility** principle
- **Proper prop typing** with interfaces
- **Accessibility considerations** in all components
- **Performance optimization** with React best practices

### Database Operations

- **Type-safe queries** using Drizzle ORM
- **Migration management** with `npm run db:push`
- **Seed data** for development environment
- **Connection pooling** for production

### Testing Strategy

- **Unit tests** for utility functions
- **Integration tests** for API endpoints
- **Accessibility testing** with automated tools
- **Manual testing** checklist for releases

## Deployment

### Environment Variables

Required configuration:

```env
DATABASE_URL=postgresql://...
NODE_ENV=production
JWT_SECRET=your-secret-key
VITE_API_URL=https://your-domain.com
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Error logging setup
- [ ] Performance monitoring
- [ ] Accessibility validation

### Performance Optimization

- **Code splitting** with React.lazy
- **Image optimization** with proper formats
- **Caching strategies** for static assets
- **Database indexing** for query performance

## Contributing

### Development Setup

1. Fork the repository
2. Create feature branch
3. Install dependencies
4. Run development server
5. Make changes following guidelines
6. Submit pull request

### Code Review Process

- **Accessibility testing** required
- **Security review** for backend changes
- **Type safety** verification
- **Documentation updates** included

### Quality Gates

- **All tests passing**
- **ESLint warnings resolved**
- **Accessibility compliance verified**
- **Security scan completed**

## Support and Resources

### Learning Resources

- [Code Quality Standards](./guides/code-quality-standards.md)
- [Security Best Practices](./tutorials/backend/implementing-security-best-practices.md)
- [Accessibility Guide](./tutorials/frontend/accessibility-implementation-guide.md)
- [API Design Patterns](./tutorials/backend/api-design-and-validation.md)

### Common Issues

- **CSP violations** - Check development vs production config
- **Database connections** - Verify environment variables
- **TypeScript errors** - Ensure proper type definitions
- **Accessibility warnings** - Review ARIA implementation

### Getting Help

1. Check existing documentation
2. Review troubleshooting guides
3. Search closed issues
4. Create new issue with details

This documentation provides comprehensive coverage of all implemented features, code quality standards, and best practices for maintaining and extending the platform.