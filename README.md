<!--
Project README - Main project documentation and setup instructions
Demonstrates comprehensive project documentation patterns and onboarding flows
📖 Learn more: /docs/guides/project-documentation.md
-->

# AGENTS.md Educational Platform

An educational open-source web application that showcases a custom GPT bot for generating AGENTS.md files used in multi-agent development workflows. The GPT can either scan public repositories with deep research or accept zip file uploads. This platform serves as a living example project to help people learn development and AI tool integration.

## 🚀 Live Demo

- **Platform**: [CodexCrafters on Replit](https://replit.com/@your-username/CodexCrafters)
- **Custom GPT**: [AGENTS.md Generator](https://chatgpt.com/g/g-6854af9ed1fc81918a30a9bf2e866602-agents-md)

## 📖 What is AGENTS.md?

AGENTS.md is a specification file that defines roles, responsibilities, and workflows for AI agents in software development projects. It enables:

- **Clear Agent Boundaries**: Define specific roles for different AI assistants
- **Consistent Workflows**: Standardize how agents collaborate on code
- **Project Structure**: Organize multi-agent development processes
- **Documentation**: Maintain clear records of agent responsibilities

## 📚 Comprehensive Learning Resources

Our `/docs` directory provides a complete learning experience for modern web development with professional-grade code quality:

### Code Quality & Best Practices
- **[Code Quality Standards](docs/guides/code-quality-standards.md)** - Comprehensive implementation guide covering type safety, validation, and maintainability
- **[Security Implementation](docs/tutorials/backend/implementing-security-best-practices.md)** - HTTP headers, rate limiting, input validation, and production security
- **[Accessibility Guide](docs/tutorials/frontend/accessibility-implementation-guide.md)** - WCAG 2.1 AA compliance with practical implementation examples
- **[API Design Patterns](docs/tutorials/backend/api-design-and-validation.md)** - Type-safe APIs with Zod validation and error handling

### Learning Paths
- **[Complete Documentation Hub](docs/README.md)** - Architecture overview, development guidelines, and deployment strategies
- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Setup, project structure, and first steps
- **[Step-by-Step Tutorials](docs/TUTORIALS.md)** - Build components, APIs, and full features
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Solutions to common development issues

## ⚡ Code Quality Standards

This platform demonstrates professional-grade development practices:

### Type Safety & Validation
- **Zero `any` types** - All data structures use explicit TypeScript interfaces
- **Runtime validation** - Zod schemas for API boundaries and user inputs
- **Type-safe database** - Drizzle ORM with complete type inference
- **Error boundaries** - Comprehensive error handling with proper types

### Security Implementation
- **HTTP security headers** - Helmet middleware with CSP, HSTS, and XSS protection
- **Rate limiting** - Configurable API protection against abuse
- **Input sanitization** - Request size limits and path validation
- **Environment-aware** - Different security configs for development/production

### Accessibility Compliance
- **WCAG 2.1 AA standard** - Complete accessibility implementation
- **Keyboard navigation** - Full app usable without mouse
- **Screen reader support** - ARIA labels and semantic HTML throughout
- **Focus management** - Visible focus indicators and logical tab order

### API Design
- **Complete CRUD operations** - Consistent endpoints with proper HTTP methods
- **Standardized errors** - Uniform error responses with validation details
- **Parameter validation** - All route parameters properly validated
- **Documentation** - Comprehensive API reference with examples

## 🎯 Features

### Educational Platform
- **Custom GPT Integration**: Direct access to our specialized AGENTS.md generator
- **Repository Analysis**: Analyze public GitHub repositories or upload ZIP files
- **Interactive Examples**: Browse real-world AGENTS.md implementations with copy functionality
- **Hands-On Tutorials**: Step-by-step coding exercises with practical examples
- **Complete Documentation**: Comprehensive guides for all skill levels

### Technical Implementation
- **Full-Stack TypeScript**: Type-safe development with shared schemas
- **PostgreSQL Database**: Persistent storage for examples and guides
- **Responsive Design**: Mobile-first UI with Tailwind CSS and shadcn/ui
- **Copy-to-Clipboard**: Interactive code examples with ChatGPT-style copy buttons
- **Real-time Data**: TanStack Query for efficient data fetching and caching

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Query** for data management
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **Zod** for runtime validation

### Development
- **Vite** for fast development and building
- **ESBuild** for TypeScript compilation
- **Drizzle Kit** for database migrations

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Juel-IT-Security/CodexCrafters.git
   cd CodexCrafters
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5000` to see the application.

## 📁 Project Structure

```
CodexCrafters/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared TypeScript definitions
│   └── schema.ts          # Database schema and types
└── docs/                  # Documentation
```

## 🔗 API Endpoints

### Examples
- `GET /api/examples` - List all AGENTS.md examples
- `GET /api/examples/:id` - Get specific example
- `POST /api/examples` - Create new example

### Guides
- `GET /api/guides` - List all video guides
- `GET /api/guides/:id` - Get specific guide
- `POST /api/guides` - Create new guide

## 🎓 Learning Resources

### Documentation
- [AGENTS.md Specification](./docs/AGENTS_SPEC.md)
- [Multi-Agent Workflows](./docs/MULTI_AGENT_WORKFLOWS.md)
- [Best Practices Guide](./docs/BEST_PRACTICES.md)
- [API Documentation](./docs/API.md)

### Video Guides
Access comprehensive video tutorials covering:
- Getting started with AGENTS.md generation
- Integrating Replit with OpenAI Codex
- Clean Git workflows for AI development
- Multi-agent project management
- Deployment strategies
- Debugging AI-generated code

## 🤝 Contributing

We welcome contributions! Please follow our Git workflow:

### Before Development
1. **Create feature branch**
   ```bash
   git checkout -b feature/[AGENT]-description
   ```

2. **Set up AGENTS.md in root**
   ```bash
   cp AGENTS.md.template AGENTS.md
   ```

3. **Review agent responsibilities**

### During Development
1. **Commit with agent tags**
   ```bash
   git commit -m "[FRONTEND] feat: add user dashboard"
   ```

2. **Keep commits atomic and focused**
   ```bash
   git add src/components/Dashboard.tsx
   git commit -m "[FRONTEND] add dashboard component"
   ```

### Before Deployment
1. **Run tests and linting**
   ```bash
   npm test && npm run lint
   ```

2. **Update documentation**
   ```bash
   git add README.md CHANGELOG.md
   git commit -m "[DOCS] update deployment guide"
   ```

### Deployment
1. **Merge to main via PR**
   ```bash
   git checkout main && git pull origin main
   ```

2. **Deploy through Replit**
   ```bash
   # Replit auto-deploys from main branch
   ```

3. **Tag release**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   ```

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Drizzle Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm test             # Run tests
```

## 🌐 Deployment

### Replit Deployment
This project is designed for easy deployment on Replit:

1. Fork this repository
2. Import into Replit
3. Set up environment variables
4. Run `npm run db:push` to initialize database
5. Deploy using Replit's hosting features

### Manual Deployment
For other platforms:

1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the server: `npm start`

## 🔒 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_database

# Development
NODE_ENV=development
PORT=5000
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify PostgreSQL is running
- Check environment variables
- Ensure database exists

**Port Already in Use**
- Change PORT in environment variables
- Kill existing processes: `pkill -f node`

**Build Failures**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT platform
- Replit for hosting and development environment
- The open-source community for the amazing tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Juel-IT-Security/CodexCrafters/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Juel-IT-Security/CodexCrafters/discussions)
- **Email**: support@juel-it-security.com

---

**Built with ❤️ by [Juel IT Security](https://github.com/Juel-IT-Security)**