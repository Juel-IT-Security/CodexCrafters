# Understanding the Database Schema

## Goal
Learn how our database is designed and how Drizzle ORM provides type-safe database operations for the AGENTS.md platform.

## What You'll Learn
- Database table design for examples and guides
- Drizzle ORM schema definition patterns
- Type generation from database schemas
- JSON fields for flexible data storage

## Database Schema Breakdown

### 1. The Examples Table

```typescript
// shared/schema.ts
export const examples = pgTable("examples", {
  // Primary key - unique ID for each example (auto-incremented)
  id: serial("id").primaryKey(),
  
  // Basic information about the project
  title: text("title").notNull(), // Project name (required)
  description: text("description").notNull(), // What the project does (required)
  projectType: text("project_type").notNull(), // "Frontend", "Backend", "Full Stack", etc.
  
  // The actual content we store
  repositoryStructure: text("repository_structure").notNull(), // File/folder structure
  generatedAgentsMd: text("generated_agents_md").notNull(), // The AI-generated AGENTS.md content
  
  // Tags stored as JSON array for flexible categorization
  // Example: ["React", "TypeScript", "E-commerce"]
  tags: json("tags").$type<string[]>().default([]),
});
```

**Key Design Decisions:**
- `serial` creates auto-incrementing primary keys
- `text` fields for variable-length strings
- `json` field allows storing arrays without additional tables
- `notNull()` enforces required fields at database level

### 2. The Guides Table

```typescript
export const guides = pgTable("guides", {
  // Primary key - unique ID for each guide
  id: serial("id").primaryKey(),
  
  // Guide information
  title: text("title").notNull(), // Guide title (required)
  description: text("description").notNull(), // What you'll learn (required)
  videoUrl: text("video_url"), // YouTube/video link (optional)
  thumbnailColor: text("thumbnail_color").notNull(), // CSS gradient for the card
  category: text("category").notNull(), // "Getting Started", "Advanced", etc.
});
```

**Why This Design:**
- Simple, flat structure for easy querying
- Optional `videoUrl` for future video integration
- `thumbnailColor` stores CSS gradients for visual variety
- Categories enable filtering and organization

## Type Safety with Drizzle

### 1. Schema-to-Type Generation

```typescript
// These types are automatically inferred from the schema
export type Example = typeof examples.$inferSelect;
export type Guide = typeof guides.$inferSelect;

// Result types:
// Example = {
//   id: number;
//   title: string;
//   description: string;
//   projectType: string;
//   repositoryStructure: string;
//   generatedAgentsMd: string;
//   tags: string[];
// }
```

**Benefits:**
- Changes to schema automatically update types
- Compile-time errors for invalid data access
- IDE autocomplete for all fields
- No manual type maintenance

### 2. Insert Schemas with Validation

```typescript
// Schema for creating new examples (excludes auto-generated ID)
export const insertExampleSchema = createInsertSchema(examples).omit({
  id: true, // ID is auto-generated, so we don't include it when creating
}).extend({
  // Override tags to be optional array of strings
  tags: z.array(z.string()).optional(),
});

export type InsertExample = z.infer<typeof insertExampleSchema>;
```

**Validation Benefits:**
- Runtime validation with Zod
- Automatic error messages
- Type-safe insert operations
- Frontend form validation

## How Database Operations Work

### 1. Query Operations

```typescript
// server/storage.ts
async getExamples(): Promise<Example[]> {
  // Drizzle provides type-safe queries
  return await db.select().from(examples);
}

async getExample(id: number): Promise<Example | undefined> {
  // Type-safe WHERE clauses
  const [example] = await db
    .select()
    .from(examples)
    .where(eq(examples.id, id));
  return example;
}
```

**Query Features:**
- `select()` returns typed results
- `where()` with type-safe conditions
- `eq()` for equality comparisons
- Array destructuring for single results

### 2. Insert Operations

```typescript
async createExample(insertExample: InsertExample): Promise<Example> {
  const [example] = await db
    .insert(examples)
    .values(insertExample)
    .returning();
  return example;
}
```

**Insert Benefits:**
- `values()` accepts typed data
- `returning()` gets the created record
- Type safety prevents invalid inserts
- Automatic ID generation

## JSON Field Usage

### 1. Tags Array Implementation

```typescript
// In the schema
tags: json("tags").$type<string[]>().default([]),

// In TypeScript usage
const example: Example = {
  // ... other fields
  tags: ["React", "TypeScript", "Frontend"]
};

// Database query for tags
const reactExamples = await db
  .select()
  .from(examples)
  .where(sql`${examples.tags} @> '["React"]'`); // PostgreSQL JSON operator
```

**JSON Benefits:**
- No need for separate tags table
- Easy to query and update
- Flexible for varying tag counts
- Built-in PostgreSQL JSON operators

### 2. Querying JSON Data

```typescript
// Find examples with specific tags
const findByTags = async (searchTags: string[]) => {
  return await db
    .select()
    .from(examples)
    .where(
      sql`${examples.tags} ?& ${searchTags}` // Has any of these tags
    );
};

// Find examples with all specified tags
const findByAllTags = async (requiredTags: string[]) => {
  return await db
    .select()
    .from(examples)
    .where(
      sql`${examples.tags} @> ${JSON.stringify(requiredTags)}` // Contains all tags
    );
};
```

## Database Connection Setup

### 1. Connection Configuration

```typescript
// server/db.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for serverless environments
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool and Drizzle instance
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

**Connection Features:**
- Environment variable configuration
- Connection pooling for performance
- Schema import for type safety
- Error handling for missing config

### 2. Database Migrations

```typescript
// Package.json script
"db:push": "drizzle-kit push"

// Pushes schema changes to database
// No manual migrations needed
// Drizzle handles schema synchronization
```

## Seed Data Implementation

### 1. Sample Data Structure

```typescript
// server/seed.ts
const sampleExamples: InsertExample[] = [
  {
    title: "React E-commerce App",
    description: "Modern React application with TypeScript, Tailwind CSS, and Stripe integration",
    projectType: "Frontend Heavy",
    repositoryStructure: `├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/`,
    generatedAgentsMd: `# AGENTS.md

> Conventions for using multi‑agent prompts with OpenAI Codex
> **Repo → React E-commerce Application**

## 1. Agent Roster & Scope

| ID | Owns / Touches | Typical Outputs |
| -- | -------------- | --------------- |
| **FRONTEND** | \`/src/**\`, React components, styling, state management | TSX components, CSS modules, custom hooks |`,
    tags: ["React", "TypeScript", "E-commerce", "Stripe", "Frontend"] as string[]
  }
];
```

**Seed Data Purpose:**
- Provides initial examples for the platform
- Demonstrates proper data structure
- Enables immediate functionality testing
- Shows realistic AGENTS.md content

## Key Learning Points

### Database Design
- Simple, focused table structures
- JSON fields for flexible data
- Proper use of constraints and defaults
- Type safety from schema to application

### Drizzle ORM Benefits
- Zero-runtime overhead
- Automatic type inference
- SQL-like query syntax
- Excellent TypeScript integration

### Data Flow
1. Schema defines structure and types
2. Database operations use typed methods
3. API routes receive typed data
4. Frontend gets predictable data structure

## Common Patterns

### Safe Data Access
```typescript
// Always handle potential undefined data
const example = await storage.getExample(id);
if (!example) {
  return res.status(404).json({ error: "Example not found" });
}
```

### Type-Safe Inserts
```typescript
// Validation before database insert
const result = insertExampleSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ 
    error: "Validation failed",
    details: result.error.errors
  });
}
```

## Next Steps

Understanding this schema enables you to:
1. Add new fields to existing tables
2. Create relationships between tables
3. Implement complex queries
4. Build type-safe APIs

## Related Concepts

- [Storage Layer Implementation](./understanding-storage-layer.md)
- [API Route Patterns](./understanding-api-routes.md)
- [Type Safety Patterns](../../CODE_CONCEPTS.md#typescript-best-practices)