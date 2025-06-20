import { db } from "./db";
import { examples, guides, type InsertExample, type InsertGuide } from "@shared/schema";

export async function seedDatabase() {
  // Check if data already exists
  const existingExamples = await db.select().from(examples).limit(1);
  if (existingExamples.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database with sample data...");

  // Sample examples
  const sampleExamples: InsertExample[] = [
    {
      title: "React E-commerce App",
      description: "Modern React application with TypeScript, Tailwind CSS, and Stripe integration",
      projectType: "Frontend Heavy",
      repositoryStructure: `├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── public/
├── package.json
└── tailwind.config.js`,
      generatedAgentsMd: `# AGENTS.md

> Conventions for using multi‑agent prompts with OpenAI Codex
> **Repo → React E-commerce Application**

---

## 1. Agent Roster & Scope

| ID | Owns / Touches | Typical Outputs |
| -- | -------------- | --------------- |
| **ARCHITECT** | ADRs, high‑level design docs, ticket decomposition, backlog grooming | \`ADR-00X.md\`, diagrams, backlog epics |
| **BACKEND** | \`/server/**\`, Express/Node.js API, payment processing, user auth | TypeScript diffs, API routes, auth middleware |
| **FRONTEND** | \`/src/**\`, React components, Tailwind styling, state management | TSX/JSX files, CSS classes, React hooks |
| **SHARED** | \`/shared/**\`, TypeScript types, validation schemas, utility functions | Shared TS libs, Zod schemas, API types |
| **INFRA** | Docker, deployment configs, environment setup | \`Dockerfile\`, \`.env.example\`, CI/CD configs |
| **QA** | E2E tests, component testing, payment flow validation | Jest tests, Cypress specs, test utilities |

### Ownership Heuristics

* Files under \`/src/**\` default to **FRONTEND**.
* Files under \`/server/**\` default to **BACKEND**.
* Files under \`/shared/**\` default to **SHARED**.
* Payment integration files require **BACKEND** + **QA** collaboration.

---

## 2. Prompt Pattern for Codex

When opening a PR or committing via Codex, prepend messages with the responsible **[AGENT]** tag:

\`\`\`text
[FRONTEND] feat(ui): add shopping cart component
\`\`\`

---

## 3. Task‑List Convention

When planning, Codex must output a markdown task list grouped by agent:

\`\`\`markdown
### FRONTEND
- [ ] Create product listing component
- [ ] Implement shopping cart functionality

### BACKEND
- [ ] Set up Stripe payment integration
- [ ] Create user authentication system

### QA
- [ ] Write E2E tests for checkout flow
- [ ] Test payment processing scenarios
\`\`\``,
      tags: ["React", "TypeScript", "E-commerce", "Frontend"]
    },
    {
      title: "Full-Stack Node.js API",
      description: "Express.js backend with PostgreSQL, Redis, and React admin dashboard",
      projectType: "Full Stack",
      repositoryStructure: `├── server/
│   ├── routes/
│   ├── models/
│   └── middleware/
├── client/
│   ├── src/
│   └── public/
├── shared/
└── docker-compose.yml`,
      generatedAgentsMd: `# AGENTS.md

> Conventions for using multi‑agent prompts with OpenAI Codex
> **Repo → Full-Stack Node.js Application**

---

## 1. Agent Roster & Scope

| ID | Owns / Touches | Typical Outputs |
| -- | -------------- | --------------- |
| **ARCHITECT** | ADRs, database schema design, API architecture | \`ADR-00X.md\`, ER diagrams, API specs |
| **BACKEND** | \`/server/**\`, Express routes, database models, Redis caching | TypeScript diffs, SQL migrations, API endpoints |
| **FRONTEND** | \`/client/**\`, React dashboard, admin interfaces, data visualization | TSX components, charts, admin forms |
| **SHARED** | \`/shared/**\`, API types, validation schemas, utilities | Shared TS libs, Zod schemas, constants |
| **INFRA** | Docker, PostgreSQL, Redis, deployment configs | \`docker-compose.yml\`, \`Dockerfile\`, K8s manifests |
| **DEVOPS** | CI/CD pipelines, monitoring, logging, database backups | GitHub Actions, Prometheus configs, backup scripts |
| **QA** | API testing, integration tests, load testing | Postman collections, Jest tests, k6 scripts |

### Ownership Heuristics

* Files under \`/server/**\` default to **BACKEND**.
* Files under \`/client/**\` default to **FRONTEND**.
* Files under \`/shared/**\` default to **SHARED**.
* Database migrations require **BACKEND** + **INFRA** collaboration.`,
      tags: ["Node.js", "Express", "PostgreSQL", "Full Stack", "API"]
    }
  ];

  // Sample guides
  const sampleGuides: InsertGuide[] = [
    {
      title: "Getting Started with AGENTS.md",
      description: "Learn how to use our GPT bot to generate your first AGENTS.md file and set up multi-agent workflows.",
      duration: "10 minutes",
      videoUrl: null,
      thumbnailColor: "from-blue-500 to-blue-700",
      category: "Getting Started"
    },
    {
      title: "Replit + OpenAI Codex Integration",
      description: "Deep dive into using Replit as your development environment with OpenAI Codex for AI-assisted coding.",
      duration: "15 minutes",
      videoUrl: null,
      thumbnailColor: "from-emerald-500 to-emerald-700",
      category: "Integration"
    },
    {
      title: "Clean Git Workflows for AI Development",
      description: "Best practices for maintaining clean commit history and branching strategies when working with AI coding assistants.",
      duration: "12 minutes",
      videoUrl: null,
      thumbnailColor: "from-purple-500 to-purple-700",
      category: "Best Practices"
    },
    {
      title: "Multi-Agent Project Management",
      description: "Advanced techniques for managing complex projects with multiple AI agents working on different components.",
      duration: "20 minutes",
      videoUrl: null,
      thumbnailColor: "from-red-500 to-red-700",
      category: "Advanced"
    },
    {
      title: "Deployment Strategies with Replit",
      description: "Learn how to deploy your AI-developed applications using Replit's hosting features and CI/CD capabilities.",
      duration: "18 minutes",
      videoUrl: null,
      thumbnailColor: "from-indigo-500 to-indigo-700",
      category: "Deployment"
    },
    {
      title: "Debugging AI-Generated Code",
      description: "Essential techniques for reviewing, testing, and debugging code generated by AI assistants and multi-agent systems.",
      duration: "16 minutes",
      videoUrl: null,
      thumbnailColor: "from-yellow-500 to-yellow-700",
      category: "Debugging"
    }
  ];

  // Insert sample data
  await db.insert(examples).values(sampleExamples);
  await db.insert(guides).values(sampleGuides);

  console.log("Database seeded successfully!");
}