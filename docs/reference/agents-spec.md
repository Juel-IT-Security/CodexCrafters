# AGENTS.md Specification

## Overview

AGENTS.md is a specification file that defines roles, responsibilities, and collaboration patterns for AI agents in software development projects. It serves as the single source of truth for multi-agent workflows.

## File Structure

```markdown
# Project Name

## Project Overview
Brief description of the project and its goals.

## Agent Definitions

### [AGENT_NAME]
**Role**: Brief description of the agent's primary function
**Responsibilities**:
- Specific task 1
- Specific task 2
- Specific task 3

**Technologies**: List of technologies this agent works with
**Dependencies**: Other agents this agent depends on
**Outputs**: What this agent produces

## Workflow Patterns

### Development Flow
1. Step-by-step process
2. Agent interactions
3. Handoff procedures

### Code Review Process
- Review responsibilities
- Quality gates
- Approval workflows

## File Ownership

### Agent Responsibilities
- **[AGENT_NAME]**: `/path/to/files/**`
- **[SHARED]**: `/shared/**`
- **[DOCS]**: `/docs/**`

## Communication Protocols

### Commit Message Format
```
[AGENT_NAME] type: description

Examples:
[FRONTEND] feat: add user authentication
[BACKEND] fix: resolve database connection issue
[DOCS] update: add API documentation
```

### Branch Naming
- Feature: `feature/[AGENT]-description`
- Bugfix: `bugfix/[AGENT]-description`
- Hotfix: `hotfix/[AGENT]-description`

## Quality Standards

### Code Quality
- Linting requirements
- Testing coverage
- Documentation standards

### Review Process
- Required reviewers
- Automated checks
- Manual verification steps
```

## Agent Types

### Common Agent Roles

#### FRONTEND
- **Responsibilities**: User interface, client-side logic, user experience
- **Technologies**: React, TypeScript, CSS frameworks
- **Files**: `/client/**`, `/src/components/**`

#### BACKEND
- **Responsibilities**: Server logic, APIs, database operations
- **Technologies**: Express, Node.js, database ORMs
- **Files**: `/server/**`, `/api/**`

#### DATABASE
- **Responsibilities**: Schema design, migrations, data modeling
- **Technologies**: PostgreSQL, Drizzle ORM, SQL
- **Files**: `/shared/schema.ts`, migration files

#### DEVOPS
- **Responsibilities**: Deployment, infrastructure, CI/CD
- **Technologies**: Docker, cloud platforms, automation tools
- **Files**: Configuration files, deployment scripts

#### DOCS
- **Responsibilities**: Documentation, guides, API specs
- **Technologies**: Markdown, documentation generators
- **Files**: `/docs/**`, `README.md`, code comments

#### TESTING
- **Responsibilities**: Test implementation, quality assurance
- **Technologies**: Testing frameworks, automation tools
- **Files**: Test files, test configurations

#### SHARED
- **Responsibilities**: Common utilities, types, configurations
- **Technologies**: TypeScript, shared libraries
- **Files**: `/shared/**`, utility functions

## Best Practices

### Agent Coordination
1. **Clear Boundaries**: Each agent has well-defined responsibilities
2. **Minimal Overlap**: Avoid duplicate work between agents
3. **Explicit Handoffs**: Document when work passes between agents
4. **Dependency Management**: Track inter-agent dependencies

### Communication
1. **Commit Tagging**: Always use agent tags in commits
2. **Documentation**: Update AGENTS.md when roles change
3. **Status Updates**: Regular communication about progress
4. **Issue Tracking**: Use agent tags in issue management

### Quality Control
1. **Agent-Specific Reviews**: Code reviews by appropriate agents
2. **Cross-Agent Testing**: Integration testing between components
3. **Documentation Sync**: Keep docs updated with code changes
4. **Automated Validation**: Use tools to enforce standards

## Implementation Examples

### Simple Web App
```markdown
### FRONTEND
**Role**: User interface and client-side functionality
**Responsibilities**:
- Component development
- State management
- User interaction handling
- Responsive design implementation

### BACKEND
**Role**: Server-side logic and API development
**Responsibilities**:
- REST API endpoints
- Business logic implementation
- Database integration
- Authentication and authorization

### DATABASE
**Role**: Data persistence and schema management
**Responsibilities**:
- Database schema design
- Migration scripts
- Query optimization
- Data validation
```

### Complex Multi-Service Application
```markdown
### USER_INTERFACE
**Role**: Frontend user experience
**Dependencies**: [API_GATEWAY]
**Outputs**: Web application, mobile app

### API_GATEWAY
**Role**: API coordination and routing
**Dependencies**: [USER_SERVICE, ORDER_SERVICE]
**Outputs**: Unified API endpoints

### USER_SERVICE
**Role**: User management and authentication
**Dependencies**: [DATABASE]
**Outputs**: User data, authentication tokens

### ORDER_SERVICE
**Role**: Order processing and management
**Dependencies**: [DATABASE, PAYMENT_SERVICE]
**Outputs**: Order data, transaction records
```

## Tools and Integration

### Code Generation
- Use AGENTS.md with AI assistants for context-aware code generation
- Provide agent context in prompts for better results
- Reference agent responsibilities for task allocation

### Project Management
- Map agents to project management tools
- Track progress by agent responsibilities
- Assign issues based on agent expertise

### Automation
- Automated agent assignment based on file changes
- Agent-specific CI/CD pipelines
- Automated documentation generation from AGENTS.md

## Validation Checklist

- [ ] All agents have clear, non-overlapping responsibilities
- [ ] File ownership is explicitly defined
- [ ] Workflow patterns are documented
- [ ] Communication protocols are established
- [ ] Quality standards are defined
- [ ] Dependencies between agents are clear
- [ ] Commit message format is standardized
- [ ] Branch naming conventions are established