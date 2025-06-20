# CodexCrafters - AGENTS.md Educational Platform

## Project Overview

CodexCrafters is an educational web application that demonstrates AI-powered multi-agent development workflows. The platform showcases how to generate and use AGENTS.md files for organizing collaborative AI development, featuring a custom GPT integration, interactive examples, and comprehensive learning resources.

## Agent Definitions

### FRONTEND
**Role**: User interface and client-side application development
**Responsibilities**:
- React component development and state management
- User interface design and responsive layouts
- Client-side routing with Wouter
- Interactive features and user experience optimization
- Integration with backend APIs using React Query
- Copy-to-clipboard functionality for code examples
- Video guide interface and educational content display

**Technologies**: React, TypeScript, Tailwind CSS, shadcn/ui, React Query, Wouter
**Dependencies**: [BACKEND] for API endpoints, [SHARED] for type definitions
**Outputs**: Web application, interactive UI components, client-side functionality

### BACKEND
**Role**: Server-side logic and API development
**Responsibilities**:
- Express.js server setup and configuration
- RESTful API endpoint development
- Database integration with Drizzle ORM
- Data validation using Zod schemas
- Static file serving for production builds
- Error handling and logging
- Seed data management for examples and guides

**Technologies**: Express.js, TypeScript, Drizzle ORM, Zod validation
**Dependencies**: [DATABASE] for schema definitions, [SHARED] for types
**Outputs**: REST API, server configuration, data processing logic

### DATABASE
**Role**: Data persistence and schema management
**Responsibilities**:
- PostgreSQL database schema design
- Drizzle ORM model definitions
- Database migrations and schema updates
- Data validation and type safety
- Example and guide data structures
- Performance optimization for queries

**Technologies**: PostgreSQL, Drizzle ORM, Drizzle Kit
**Dependencies**: None (foundational layer)
**Outputs**: Database schema, migration files, type-safe data models

### DOCS
**Role**: Documentation and educational content
**Responsibilities**:
- Comprehensive project documentation
- AGENTS.md specification and examples
- Contributing guidelines and workflows
- API documentation and usage examples
- Best practices guides and tutorials
- Code comments and inline documentation
- Learning resource organization

**Technologies**: Markdown, JSDoc comments
**Dependencies**: All agents for accurate documentation
**Outputs**: Documentation files, guides, specifications, comments

### SHARED
**Role**: Common utilities and shared resources
**Responsibilities**:
- TypeScript type definitions and interfaces
- Database schema exports for frontend/backend
- Zod validation schemas
- Common utility functions
- Shared constants and configurations
- Cross-cutting concerns and reusable logic

**Technologies**: TypeScript, Zod, utility libraries
**Dependencies**: [DATABASE] for schema definitions
**Outputs**: Type definitions, validation schemas, utility functions

## Workflow Patterns

### Development Flow
1. **Planning**: Review AGENTS.md for agent responsibilities and dependencies
2. **Branch Creation**: Create feature branch with agent prefix (`feature/[AGENT]-description`)
3. **Implementation**: Develop within agent boundaries, following single responsibility
4. **Testing**: Validate changes meet quality standards and don't break dependencies
5. **Documentation**: Update relevant docs and maintain agent context
6. **Integration**: Merge through pull request with agent-specific review
7. **Deployment**: Deploy via Replit's automatic deployment from main branch

### Code Review Process
- **Agent-Specific Review**: Code reviewed by experts in the relevant agent domain
- **Cross-Agent Impact**: Additional review when changes affect multiple agents
- **Documentation Review**: Ensure docs reflect code changes accurately
- **Quality Gates**: TypeScript compilation, linting, and validation checks
- **Approval Workflow**: Maintainer approval required for merge to main

### Handoff Procedures
- **FRONTEND → BACKEND**: API requirements and data format specifications
- **BACKEND → DATABASE**: Schema changes and query requirements
- **Any Agent → DOCS**: Documentation updates for new features or changes
- **DATABASE → SHARED**: Type updates and schema exports
- **SHARED → All Agents**: Updated utilities and type definitions

## File Ownership

### Agent Responsibilities
- **FRONTEND**: `client/src/**` - All React components, pages, hooks, and client utilities
- **BACKEND**: `server/**` - Express server, routes, storage, and server configuration
- **DATABASE**: `shared/schema.ts`, `server/db.ts` - Schema definitions and database setup
- **DOCS**: `docs/**`, `README.md`, `CONTRIBUTING.md` - All documentation files
- **SHARED**: `shared/**` (excluding schema.ts) - Common types, utilities, and configurations

### Shared Ownership
- **Root Configuration**: `package.json`, `tsconfig.json`, `vite.config.ts` - Requires multi-agent coordination
- **Environment**: `.env.example`, deployment configs - [BACKEND] + [DOCS] collaboration
- **Build System**: Vite configuration, build scripts - [FRONTEND] + [BACKEND] coordination

## Communication Protocols

### Commit Message Format
```
[AGENT_NAME] type: description

Types: feat, fix, docs, style, refactor, test, chore

Examples:
[FRONTEND] feat: add copy-to-clipboard functionality for code blocks
[BACKEND] fix: resolve database connection pooling issue
[DATABASE] add: video guides table schema
[DOCS] update: contributing guidelines for multi-agent workflow
[SHARED] refactor: improve type definitions for API responses
```

### Branch Naming Conventions
- **Feature**: `feature/[AGENT]-brief-description`
  - `feature/FRONTEND-copy-buttons`
  - `feature/BACKEND-guide-api`
  - `feature/DATABASE-schema-cleanup`
- **Bugfix**: `bugfix/[AGENT]-issue-description`
- **Documentation**: `docs/[AGENT]-documentation-update`
- **Hotfix**: `hotfix/[AGENT]-critical-fix`

### Issue and PR Labels
- Agent labels: `agent-frontend`, `agent-backend`, `agent-database`, `agent-docs`, `agent-shared`
- Type labels: `bug`, `enhancement`, `documentation`, `question`
- Priority labels: `priority-high`, `priority-medium`, `priority-low`
- Status labels: `needs-review`, `needs-testing`, `ready-to-merge`

## Quality Standards

### Code Quality Requirements
- **TypeScript**: Strict mode enabled, no implicit any types
- **Linting**: ESLint rules enforced for consistency
- **Formatting**: Prettier for consistent code style
- **Testing**: Unit tests for complex business logic
- **Documentation**: JSDoc comments for public APIs

### Agent-Specific Standards

#### FRONTEND
- Component-based architecture with clear props interfaces
- Responsive design using Tailwind CSS breakpoints
- Accessibility standards (WCAG 2.1 AA)
- Performance optimization for React components
- State management best practices

#### BACKEND
- RESTful API design principles
- Input validation using Zod schemas
- Error handling with appropriate HTTP status codes
- Database query optimization
- Security best practices for web APIs

#### DATABASE
- Normalized database design
- Foreign key constraints and data integrity
- Migration scripts for schema changes
- Performance indexing for common queries
- Data validation at the database level

#### DOCS
- Clear, concise writing style
- Code examples with proper syntax highlighting
- Up-to-date screenshots and diagrams
- Comprehensive API documentation
- Beginner-friendly explanations

#### SHARED
- Pure functions without side effects
- Comprehensive type definitions
- Reusable and modular design
- Consistent naming conventions
- Proper error handling

### Review Requirements
- **Self-Review**: Author reviews own changes before submission
- **Agent Review**: Expert in relevant agent domain reviews code
- **Documentation Review**: For user-facing changes
- **Integration Testing**: Verify changes work across agent boundaries
- **Performance Review**: For changes affecting application performance

## Integration Points

### API Contracts
- **GET /api/examples**: FRONTEND consumes BACKEND example data
- **GET /api/guides**: FRONTEND displays BACKEND guide information
- **POST /api/examples**: Future functionality for user-submitted examples
- **Type Safety**: SHARED schemas ensure consistent data flow

### Database Dependencies
- **Examples Table**: Stores AGENTS.md examples with metadata
- **Guides Table**: Video guide information without duration (removed for YouTube embeds)
- **Schema Changes**: DATABASE agent coordinates with BACKEND for storage layer updates

### Build Dependencies
- **TypeScript Compilation**: SHARED types used by FRONTEND and BACKEND
- **Vite Build**: FRONTEND build process integrated with BACKEND static serving
- **Development**: Hot reloading and development server coordination

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reloading
- **Production**: Replit deployment with PostgreSQL database
- **Database**: Automatic migration on deployment
- **Static Assets**: Served through Express in production

### Deployment Process
1. **Pre-deployment Checks**: All quality gates pass
2. **Merge to Main**: Automatic deployment trigger
3. **Database Migration**: Schema changes applied automatically
4. **Health Checks**: Verify application startup and database connectivity
5. **Rollback Plan**: Git revert capability for critical issues

### Monitoring and Maintenance
- **Error Logging**: Server-side error tracking
- **Performance Monitoring**: Database query performance
- **Uptime Monitoring**: Application availability checks
- **Security Updates**: Dependency vulnerability scanning

## Success Metrics

### Educational Objectives
- Clear demonstration of multi-agent workflows
- Comprehensive learning resources for AI development
- Interactive examples that help users understand AGENTS.md
- Proper documentation for open-source contribution

### Technical Objectives
- Type-safe full-stack application
- Responsive and accessible user interface
- Reliable data persistence and retrieval
- Maintainable and well-documented codebase
- Efficient development workflow with clear agent boundaries

This AGENTS.md file serves as the authoritative source for understanding how different AI agents collaborate in the CodexCrafters project, demonstrating practical implementation of multi-agent development patterns.