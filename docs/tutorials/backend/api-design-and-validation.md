# API Design and Validation Best Practices

Learn how to design robust, type-safe APIs with comprehensive validation, error handling, and consistent patterns that scale with your application.

## Complete CRUD Implementation

### RESTful API Design

Implement complete CRUD operations for all resources:

```typescript
// Examples Resource
GET    /api/examples     - List all examples
GET    /api/examples/:id - Get specific example
POST   /api/examples     - Create new example
PUT    /api/examples/:id - Update example (full replacement)
PATCH  /api/examples/:id - Update example (partial)
DELETE /api/examples/:id - Delete example

// Guides Resource
GET    /api/guides       - List all guides
GET    /api/guides/:id   - Get specific guide
POST   /api/guides       - Create new guide
PUT    /api/guides/:id   - Update guide
DELETE /api/guides/:id   - Delete guide
```

### Implementation Pattern

```typescript
import { insertExampleSchema, insertGuideSchema } from "../shared/schema";
import { ZodError } from "zod";

// GET Collection
app.get("/api/examples", async (_req, res) => {
  try {
    const examples = await storage.getExamples();
    res.json(examples);
  } catch (error: unknown) {
    console.error("Error fetching examples:", error);
    res.status(500).json({ message: "Failed to fetch examples" });
  }
});

// GET Single Resource
app.get("/api/examples/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Validate ID parameter
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const example = await storage.getExample(id);
    
    if (!example) {
      return res.status(404).json({ message: "Example not found" });
    }
    
    res.json(example);
  } catch (error: unknown) {
    console.error("Error fetching example:", error);
    res.status(500).json({ message: "Failed to fetch example" });
  }
});

// POST Create Resource
app.post("/api/examples", async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = insertExampleSchema.parse(req.body);
    
    // Create the resource
    const newExample = await storage.createExample(validatedData);
    
    // Return created resource with 201 status
    res.status(201).json(newExample);
  } catch (error: unknown) {
    console.error("Error creating example:", error);
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Invalid example data", 
        errors: error.errors 
      });
    }
    
    // Handle other errors
    res.status(500).json({ message: "Failed to create example" });
  }
});
```

## Zod Schema Validation

### Schema Definition

Define comprehensive validation schemas:

```typescript
// shared/schema.ts
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Database table schema
export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  technology: varchar("technology", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  githubUrl: varchar("github_url", { length: 500 }),
  demoUrl: varchar("demo_url", { length: 500 }),
  tags: varchar("tags", { length: 100 }).array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create insert schema from table, omitting auto-generated fields
export const insertExampleSchema = createInsertSchema(examples).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Add custom validation rules
  title: z.string().min(5).max(255),
  description: z.string().min(20).max(1000),
  technology: z.string().min(2).max(100),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
});

// Type inference
export type InsertExample = z.infer<typeof insertExampleSchema>;
export type Example = typeof examples.$inferSelect;
```

### Advanced Validation Patterns

```typescript
// Conditional validation
const userSchema = z.object({
  type: z.enum(["individual", "organization"]),
  name: z.string().min(2),
  email: z.string().email(),
  // Conditional field based on type
  organizationName: z.string().optional(),
}).refine((data) => {
  // If type is organization, organizationName is required
  if (data.type === "organization" && !data.organizationName) {
    return false;
  }
  return true;
}, {
  message: "Organization name is required for organization accounts",
  path: ["organizationName"],
});

// Custom validation functions
const createGuideSchema = insertGuideSchema.extend({
  videoUrl: z.string().refine((url) => {
    // Custom YouTube URL validation
    return /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(url);
  }, {
    message: "Must be a valid YouTube URL",
  }),
});
```

## Error Handling Patterns

### Standardized Error Responses

```typescript
// Error response interface
interface ApiError {
  message: string;
  code?: string;
  errors?: any[];
  timestamp: string;
}

// Error handler middleware
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const errorResponse: ApiError = {
    message: "Internal server error",
    timestamp: new Date().toISOString(),
  };

  // Validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      ...errorResponse,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: error.errors,
    });
  }

  // Database errors
  if (error.code === "23505") { // Unique constraint violation
    return res.status(409).json({
      ...errorResponse,
      message: "Resource already exists",
      code: "DUPLICATE_RESOURCE",
    });
  }

  // Not found errors
  if (error.message === "NOT_FOUND") {
    return res.status(404).json({
      ...errorResponse,
      message: "Resource not found",
      code: "NOT_FOUND",
    });
  }

  // Log error for debugging
  console.error("Unhandled error:", error);

  // Generic error response
  res.status(500).json(errorResponse);
};

app.use(errorHandler);
```

### Error Throwing Patterns

```typescript
// Custom error classes
class NotFoundError extends Error {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Usage in route handlers
app.get("/api/examples/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw new ValidationError("Invalid ID format", "id");
    }
    
    const example = await storage.getExample(id);
    
    if (!example) {
      throw new NotFoundError("Example", id);
    }
    
    res.json(example);
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

## Type Safety Implementation

### Interface Definitions

Replace generic types with specific interfaces:

```typescript
// Before: Using any[]
const structure = {
  sections: [] as any[],
  totalFiles: 0,
  totalTutorials: 0
};

// After: Proper type definitions
interface DocsFile {
  name: string;
  title: string;
  description: string;
  path: string;
  size: number;
}

interface DocsSubsection {
  id: string;
  title: string;
  path: string;
  files: DocsFile[];
}

interface DocsSection {
  id: string;
  title: string;
  path: string;
  files: DocsFile[];
  subsections: DocsSubsection[];
}

interface DocsStructure {
  sections: DocsSection[];
  totalFiles: number;
  totalTutorials: number;
}

const structure: DocsStructure = {
  sections: [],
  totalFiles: 0,
  totalTutorials: 0
};
```

### Storage Interface Design

```typescript
// Define storage interface with proper types
export interface IStorage {
  // Examples operations
  getExamples(): Promise<Example[]>;
  getExample(id: number): Promise<Example | undefined>;
  createExample(example: InsertExample): Promise<Example>;
  updateExample(id: number, example: Partial<InsertExample>): Promise<Example>;
  deleteExample(id: number): Promise<void>;
  
  // Guides operations
  getGuides(): Promise<Guide[]>;
  getGuide(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
  updateGuide(id: number, guide: Partial<InsertGuide>): Promise<Guide>;
  deleteGuide(id: number): Promise<void>;
}

// Implementation with proper error handling
export class DatabaseStorage implements IStorage {
  async getExample(id: number): Promise<Example | undefined> {
    try {
      const [example] = await db
        .select()
        .from(examples)
        .where(eq(examples.id, id));
      
      return example;
    } catch (error) {
      console.error("Database error fetching example:", error);
      throw new Error("Failed to fetch example from database");
    }
  }

  async createExample(insertExample: InsertExample): Promise<Example> {
    try {
      const [newExample] = await db
        .insert(examples)
        .values(insertExample)
        .returning();
      
      return newExample;
    } catch (error) {
      console.error("Database error creating example:", error);
      
      // Handle specific database errors
      if (error.code === "23505") {
        throw new Error("Example with this title already exists");
      }
      
      throw new Error("Failed to create example");
    }
  }
}
```

## Request/Response Patterns

### Pagination Implementation

```typescript
// Pagination schema
const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

type PaginationQuery = z.infer<typeof paginationSchema>;

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Implementation
app.get("/api/examples", async (req, res) => {
  try {
    const query = paginationSchema.parse(req.query);
    
    const { data: examples, total } = await storage.getExamplesPaginated(query);
    
    const totalPages = Math.ceil(total / query.limit);
    
    const response: PaginatedResponse<Example> = {
      data: examples,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
});
```

### Filtering and Search

```typescript
// Search schema
const searchSchema = z.object({
  q: z.string().optional(), // General search query
  technology: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string()).optional(),
});

type SearchQuery = z.infer<typeof searchSchema>;

// Implementation with type-safe filtering
app.get("/api/examples/search", async (req, res) => {
  try {
    const searchParams = searchSchema.parse(req.query);
    const paginationParams = paginationSchema.parse(req.query);
    
    const results = await storage.searchExamples(searchParams, paginationParams);
    
    res.json(results);
  } catch (error) {
    next(error);
  }
});
```

## Testing API Endpoints

### Unit Testing with Type Safety

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { insertExampleSchema } from "../shared/schema";

describe("API Validation", () => {
  it("should validate example creation data", () => {
    const validData = {
      title: "Test Example",
      description: "A test example for validation",
      technology: "TypeScript",
      difficulty: "beginner" as const,
      githubUrl: "https://github.com/test/repo",
    };

    const result = insertExampleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid data", () => {
    const invalidData = {
      title: "A", // Too short
      description: "Short", // Too short
      technology: "",
      difficulty: "invalid", // Not in enum
    };

    const result = insertExampleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors).toHaveLength(4);
    }
  });
});

// Integration testing
describe("Examples API", () => {
  it("should create example with valid data", async () => {
    const validExample = {
      title: "Test Example",
      description: "A comprehensive test example",
      technology: "React",
      difficulty: "intermediate",
    };

    const response = await request(app)
      .post("/api/examples")
      .send(validExample)
      .expect(201);

    expect(response.body).toMatchObject(validExample);
    expect(response.body.id).toBeDefined();
  });

  it("should return 400 for invalid data", async () => {
    const invalidExample = {
      title: "A", // Too short
    };

    await request(app)
      .post("/api/examples")
      .send(invalidExample)
      .expect(400);
  });
});
```

This comprehensive API design ensures type safety, proper validation, consistent error handling, and maintainable code that scales with your application's growth.