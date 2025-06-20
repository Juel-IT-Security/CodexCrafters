# Getting Started with Development

Welcome to the AGENTS.md Educational Platform! This guide will help you learn modern web development practices through hands-on experience.

## What You'll Learn

This platform teaches you:
- **Full-stack JavaScript development** with React and Node.js
- **Database design** with PostgreSQL and Drizzle ORM
- **API development** with Express.js
- **Modern UI development** with Tailwind CSS and shadcn/ui
- **AI integration** for code generation and analysis
- **Multi-agent development workflows**

## Prerequisites

Before starting, you should have basic knowledge of:
- JavaScript fundamentals
- HTML and CSS basics
- Command line usage
- Git version control

## Development Environment Setup

### 1. Understanding the Project Structure

```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
├── server/          # Backend Express application
│   ├── routes.ts    # API endpoint definitions
│   ├── storage.ts   # Database operations
│   └── db.ts        # Database connection
├── shared/          # Shared types and schemas
│   └── schema.ts    # Database schema definitions
└── docs/            # Documentation and learning resources
```

### 2. Key Technologies Used

**Frontend Stack:**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing

**Backend Stack:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database queries

### 3. Running the Application

The project uses a single command to start both frontend and backend:

```bash
npm run dev
```

This starts:
- Express server on port 5000 (API)
- Vite development server (frontend)
- Database connection to PostgreSQL

## Learning Path

### Beginner Track

1. **Start with the Frontend**
   - Explore `client/src/components/` to see modern React patterns
   - Learn about component composition and props
   - Understand state management with hooks

2. **Understand the Database**
   - Review `shared/schema.ts` for data modeling
   - Learn about relationships and constraints
   - Practice with SQL queries

3. **Build Your First Feature**
   - Add a new field to an existing model
   - Create a simple form component
   - Connect frontend to backend API

### Intermediate Track

1. **API Development**
   - Study `server/routes.ts` for REST patterns
   - Learn request validation with Zod
   - Implement error handling

2. **Advanced React Patterns**
   - Custom hooks in `client/src/hooks/`
   - Context providers for global state
   - Performance optimization techniques

3. **Database Operations**
   - Complex queries with Drizzle ORM
   - Database migrations and schema changes
   - Query optimization

### Advanced Track

1. **Architecture Patterns**
   - Separation of concerns
   - Dependency injection
   - Testing strategies

2. **AI Integration**
   - Using the AGENTS.md GPT
   - Code generation workflows
   - Multi-agent development

3. **Production Deployment**
   - Environment configuration
   - Database management
   - Performance monitoring

## Hands-On Exercises

### Exercise 1: Add a New Field

**Goal:** Add a "difficulty" field to the guides

1. Update the database schema in `shared/schema.ts`
2. Run database migration with `npm run db:push`
3. Update the API endpoints in `server/routes.ts`
4. Add form input in the frontend components

### Exercise 2: Create a New Component

**Goal:** Build a search filter for examples

1. Create a new component in `client/src/components/`
2. Implement search functionality with React hooks
3. Connect to the examples API
4. Add proper TypeScript types

### Exercise 3: Implement Authentication

**Goal:** Add user login system

1. Design user schema in the database
2. Create authentication endpoints
3. Build login/register forms
4. Implement protected routes

## Common Patterns

### Database Operations

```typescript
// Define schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
});

// Type-safe queries
const user = await db.select().from(users).where(eq(users.id, userId));
```

### API Endpoints

```typescript
// Validated request handling
app.post("/api/users", async (req, res) => {
  const result = insertUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid data" });
  }
  
  const user = await storage.createUser(result.data);
  res.json(user);
});
```

### React Components

```typescript
// Form with validation
export function UserForm() {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });
  
  const mutation = useMutation({
    mutationFn: (data: InsertUser) => apiRequest("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  });
  
  return (
    <Form {...form}>
      {/* Form fields */}
    </Form>
  );
}
```

## Next Steps

1. Explore the codebase systematically
2. Try the hands-on exercises
3. Read the additional documentation:
   - [API Documentation](./API.md)
   - [Contributing Guide](./CONTRIBUTING.md)
   - [Architecture Guide](./ARCHITECTURE.md)
4. Build your own features
5. Contribute back to the project

## Getting Help

- Review the existing code for patterns and examples
- Check the documentation in `/docs`
- Look at the AGENTS.md file for multi-agent workflows
- Experiment with the GPT bot for code generation

Remember: The best way to learn is by building. Start small, experiment freely, and gradually tackle more complex features!