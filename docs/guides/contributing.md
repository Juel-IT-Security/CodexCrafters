# Contributing to CodexCrafters

Welcome to CodexCrafters! This guide will help you understand our development workflow and contribution standards.

## Git Submission Workflow

We follow a structured multi-agent development approach. Each contribution should follow these steps:

### 1. Before Development

**Create Feature Branch**
```bash
git checkout -b feature/[AGENT]-description
```

**Set Up AGENTS.md**
```bash
cp AGENTS.md.template AGENTS.md
# Review and update agent responsibilities
```

**Review Agent Responsibilities**
- Read the project's AGENTS.md file
- Understand which agent role you're working as
- Identify dependencies and interfaces with other agents

### 2. During Development

**Commit with Agent Tags**
All commits must include agent tags to identify responsibility:

```bash
# Frontend changes
git commit -m "[FRONTEND] feat: add user dashboard component"

# Backend changes  
git commit -m "[BACKEND] fix: resolve database connection timeout"

# Database changes
git commit -m "[DATABASE] add: user preferences table schema"

# Documentation updates
git commit -m "[DOCS] update: API endpoint documentation"

# Shared utilities
git commit -m "[SHARED] refactor: improve type definitions"
```

**Keep Commits Atomic**
Each commit should represent a single, focused change:

```bash
# Good: Single component addition
git add src/components/UserProfile.tsx
git commit -m "[FRONTEND] add: user profile component"

# Good: Related styles for the same component
git add src/components/UserProfile.tsx src/styles/profile.css
git commit -m "[FRONTEND] style: add user profile styling"
```

**Update Documentation**
Keep documentation in sync with code changes:

```bash
# Update relevant documentation
git add docs/API.md
git commit -m "[DOCS] update: user profile API endpoints"
```

### 3. Before Deployment

**Run Quality Checks**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Tests (when available)
npm test

# Database validation
npm run db:push --dry-run
```

**Update Documentation**
```bash
# Update changelog
git add CHANGELOG.md
git commit -m "[DOCS] update: v1.2.0 release notes"

# Update README if needed
git add README.md  
git commit -m "[DOCS] update: installation instructions"
```

**Review Changes**
- Ensure all commits follow agent tagging
- Verify documentation is updated
- Check that changes align with AGENTS.md responsibilities

### 4. Deployment Process

**Create Pull Request**
- Title: `[AGENT] Brief description of changes`
- Description: Include agent context and testing notes
- Link to relevant issues

**Merge Requirements**
- All checks must pass
- Agent-appropriate code review
- Documentation review for user-facing changes

**Deploy to Main**
```bash
git checkout main
git pull origin main
# Replit auto-deploys from main branch
```

**Tag Release**
```bash
git tag -a v1.2.0 -m "Release v1.2.0: User profile features"
git push origin v1.2.0
```

## Agent Responsibilities

### FRONTEND
- React components and client-side logic
- User interface and experience
- State management
- Client-side routing and navigation
- Responsive design implementation

**Files**: `client/src/**`

### BACKEND  
- Express server and API endpoints
- Business logic and data processing
- Authentication and authorization
- Server-side routing
- Integration with external services

**Files**: `server/**`

### DATABASE
- Schema design and migrations
- Database operations and queries
- Data validation and constraints
- Performance optimization
- Backup and recovery procedures

**Files**: `shared/schema.ts`, `server/db.ts`, `server/storage.ts`

### DOCS
- Documentation writing and maintenance
- API specification
- User guides and tutorials
- Code comments and inline documentation
- README and setup instructions

**Files**: `docs/**`, `README.md`, code comments

### SHARED
- Common utilities and helpers
- Type definitions and interfaces
- Shared constants and configurations
- Cross-cutting concerns
- Reusable business logic

**Files**: `shared/**`

## Code Quality Standards

### TypeScript Requirements
- All code must be properly typed
- Use strict TypeScript configuration
- Avoid `any` types except when absolutely necessary
- Export types from shared schemas

### Code Style
- Use Prettier for consistent formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Testing Guidelines
- Write unit tests for complex business logic
- Test API endpoints with various inputs
- Include integration tests for critical workflows
- Mock external dependencies appropriately

### Documentation Standards
- Update README for significant changes
- Document API endpoints with examples
- Include setup instructions for new features
- Write clear commit messages

## Pull Request Guidelines

### PR Title Format
```
[AGENT] type: brief description

Examples:
[FRONTEND] feat: add user authentication flow
[BACKEND] fix: resolve database connection pooling
[DOCS] update: API documentation for v2 endpoints
```

### PR Description Template
```markdown
## Agent Context
**Agent Role**: [FRONTEND/BACKEND/DATABASE/DOCS/SHARED]
**Dependencies**: List any other agents this affects

## Changes Made
- Bullet point list of changes
- Include both technical and user-facing changes

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass  
- [ ] Manual testing completed
- [ ] Documentation updated

## Screenshots (if applicable)
Include before/after screenshots for UI changes

## Breaking Changes
List any breaking changes and migration steps
```

### Review Process
1. **Automated Checks**: All CI checks must pass
2. **Agent Review**: Code reviewed by appropriate agent expert
3. **Documentation Review**: For user-facing changes
4. **Final Approval**: Project maintainer approval

## Development Environment

### Required Tools
- Node.js 18+
- PostgreSQL
- Git
- Code editor with TypeScript support

### Setup Commands
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:push
npm run db:seed

# Start development
npm run dev
```

### Environment Variables
```bash
# Database connection
DATABASE_URL=postgresql://user:pass@host:port/db
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=codexcrafters

# Development settings
NODE_ENV=development
PORT=5000
```

## Issue Reporting

### Bug Reports
Use the agent tag system when reporting bugs:

**Title**: `[AGENT] Brief description of bug`
**Labels**: `bug`, `agent-[name]`

### Feature Requests
**Title**: `[AGENT] Brief description of feature`
**Labels**: `enhancement`, `agent-[name]`

### Issue Template
```markdown
## Agent Context
**Affected Agent(s)**: [FRONTEND/BACKEND/DATABASE/DOCS/SHARED]

## Description
Clear description of the issue or request

## Steps to Reproduce (for bugs)
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome, Firefox] (for frontend issues)
```

## Release Process

### Version Numbering
We follow semantic versioning (semver):
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Patch** (1.1.1): Bug fixes, backward compatible

### Release Steps
1. Update version in `package.json`
2. Update `CHANGELOG.md` with release notes
3. Create release commit: `[RELEASE] v1.2.0`
4. Tag release: `git tag -a v1.2.0 -m "Release v1.2.0"`
5. Push to main: `git push origin main --tags`
6. Create GitHub release with release notes

## Getting Help

### Resources
- [AGENTS.md Specification](./AGENTS_SPEC.md)
- [API Documentation](./API.md)
- [Best Practices Guide](./BEST_PRACTICES.md)

### Communication Channels
- **Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Email**: For security issues or private matters

### Mentorship
New contributors are welcome! Feel free to:
- Start with "good first issue" labeled tickets
- Ask questions in discussions
- Request code review feedback
- Pair program with experienced contributors

Thank you for contributing to CodexCrafters!