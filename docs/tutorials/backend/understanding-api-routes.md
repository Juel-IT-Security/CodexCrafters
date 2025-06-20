# Understanding API Routes

## Overview

API routes are the backbone of your backend application. They define how your frontend communicates with the server and database. This tutorial explains how our route system works and the patterns used throughout the application.

## What You'll Learn

- How Express.js routes work
- RESTful API design principles
- Error handling patterns
- Request validation and security
- Database integration through storage layer

## Route Structure Overview

Our API follows a clear, organized structure:

```typescript
// server/routes.ts
export async function registerRoutes(app: Express): Promise<Server> {
  // Examples API - handles project examples
  app.get("/api/examples", handleGetExamples);
  app.get("/api/examples/:id", handleGetExample);
  app.post("/api/examples", handleCreateExample);
  
  // Guides API - handles tutorial guides
  app.get("/api/guides", handleGetGuides);
  app.get("/api/guides/:id", handleGetGuide);
  app.post("/api/guides", handleCreateGuide);
  
  // Documentation API - handles docs system
  app.get("/api/docs", handleGetDocsStructure);
  app.get("/api/docs/content", handleGetDocContent);
}
```

## Basic Route Pattern

Every route follows this consistent pattern:

### 1. Route Definition

```typescript
// GET /api/examples - Retrieve all examples
app.get("/api/examples", async (_req, res) => {
  try {
    // Business logic here
  } catch (error) {
    // Error handling here
  }
});
```

**Key Components:**
- **HTTP Method**: `GET`, `POST`, `PUT`, `DELETE`
- **Path**: `/api/examples` - consistent API prefix
- **Handler**: Async function that processes the request
- **Error Handling**: Try-catch for all operations

### 2. Request Processing

```typescript
app.get("/api/examples/:id", async (req, res) => {
  try {
    // Extract parameter from URL
    const id = parseInt(req.params.id);
    
    // Validate the parameter
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    // Call storage layer
    const example = await storage.getExample(id);
    
    // Handle not found case
    if (!example) {
      return res.status(404).json({ message: "Example not found" });
    }
    
    // Return successful response
    res.json(example);
  } catch (error) {
    console.error("Error fetching example:", error);
    res.status(500).json({ message: "Failed to fetch example" });
  }
});
```

**Request Flow:**
1. **Extract Data**: Get parameters, query strings, or body data
2. **Validate Input**: Check for required fields and correct formats
3. **Business Logic**: Call storage layer or perform operations
4. **Handle Results**: Return appropriate response with status codes
5. **Error Handling**: Catch and return meaningful error messages

### 3. POST Route for Creating Data

```typescript
app.post("/api/examples", async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = insertExampleSchema.parse(req.body);
    
    // Create the new example
    const newExample = await storage.createExample(validatedData);
    
    // Return created resource with 201 status
    res.status(201).json(newExample);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: error.errors 
      });
    }
    
    console.error("Error creating example:", error);
    res.status(500).json({ message: "Failed to create example" });
  }
});
```

**Creation Flow:**
1. **Parse Body**: Extract data from request body
2. **Validate Schema**: Use Zod schemas for type safety
3. **Create Resource**: Call storage layer to persist data
4. **Return Result**: Send back created resource with 201 status

## HTTP Status Codes

Our API uses standard HTTP status codes consistently:

```typescript
// Success responses
res.status(200).json(data);        // OK - successful GET/PUT
res.status(201).json(newData);     // Created - successful POST
res.status(204).send();            // No Content - successful DELETE

// Client error responses
res.status(400).json({ message: "Bad Request" });     // Invalid input
res.status(401).json({ message: "Unauthorized" });    // Authentication required
res.status(403).json({ message: "Forbidden" });       // Permission denied
res.status(404).json({ message: "Not Found" });       // Resource doesn't exist
res.status(409).json({ message: "Conflict" });        // Resource already exists

// Server error responses
res.status(500).json({ message: "Internal Server Error" });
```

## Request Validation

We use Zod schemas for runtime type validation:

```typescript
import { insertExampleSchema } from "@shared/schema";

app.post("/api/examples", async (req, res) => {
  try {
    // This validates the request body against the schema
    const validatedData = insertExampleSchema.parse(req.body);
    
    // If validation passes, we know the data is correct
    const newExample = await storage.createExample(validatedData);
    res.status(201).json(newExample);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return detailed validation errors
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    res.status(500).json({ message: "Failed to create example" });
  }
});
```

**Validation Benefits:**
- **Type Safety**: Ensures data matches expected structure
- **Runtime Checking**: Catches invalid data at runtime
- **Clear Errors**: Provides specific validation error messages
- **Shared Schemas**: Same validation on frontend and backend

## Storage Layer Integration

Routes delegate to the storage layer for data operations:

```typescript
// Route handler - thin layer that handles HTTP concerns
app.get("/api/examples", async (_req, res) => {
  try {
    const examples = await storage.getExamples();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch examples" });
  }
});

// Storage layer - handles business logic and database operations
class DatabaseStorage implements IStorage {
  async getExamples(): Promise<Example[]> {
    return await db.select().from(examples);
  }
}
```

**Separation of Concerns:**
- **Routes**: Handle HTTP protocol, validation, error responses
- **Storage**: Handle business logic, database operations
- **Database**: Handle data persistence and queries

## Error Handling Patterns

### 1. Try-Catch Blocks

```typescript
app.get("/api/examples", async (_req, res) => {
  try {
    const examples = await storage.getExamples();
    res.json(examples);
  } catch (error) {
    console.error("Error fetching examples:", error);
    res.status(500).json({ message: "Failed to fetch examples" });
  }
});
```

### 2. Specific Error Types

```typescript
app.get("/api/examples/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const example = await storage.getExample(id);
    
    if (!example) {
      return res.status(404).json({ message: "Example not found" });
    }
    
    res.json(example);
  } catch (error) {
    console.error("Error fetching example:", error);
    res.status(500).json({ message: "Failed to fetch example" });
  }
});
```

### 3. Global Error Handler

```typescript
// Global error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

## Security Considerations

### 1. Input Validation

```typescript
// Always validate and sanitize input
const id = parseInt(req.params.id);
if (isNaN(id) || id < 1) {
  return res.status(400).json({ message: "Invalid ID" });
}
```

### 2. SQL Injection Prevention

```typescript
// Using Drizzle ORM prevents SQL injection
const example = await db.select()
  .from(examples)
  .where(eq(examples.id, id));  // Safe parameterized query
```

### 3. Path Traversal Protection

```typescript
// Validate file paths to prevent directory traversal
const safePath = path.join(process.cwd(), 'docs', filePath);
const normalizedPath = path.normalize(safePath);
const docsPath = path.normalize(path.join(process.cwd(), 'docs'));

if (!normalizedPath.startsWith(docsPath)) {
  return res.status(403).json({ message: "Access denied" });
}
```

## Documentation API Example

Our documentation API demonstrates advanced patterns:

```typescript
// GET /api/docs - Get documentation structure
app.get("/api/docs", async (req, res) => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const docsPath = path.join(process.cwd(), 'docs');
    const structure = await buildDocsStructure(docsPath);
    
    res.json(structure);
  } catch (error) {
    console.error("Error reading docs structure:", error);
    res.status(500).json({ message: "Failed to load documentation structure" });
  }
});

// GET /api/docs/content - Get specific file content
app.get("/api/docs/content", async (req, res) => {
  try {
    const { path: filePath } = req.query;
    
    // Validate required parameter
    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ message: "File path is required" });
    }
    
    // Security: ensure path is safe
    const safePath = path.join(process.cwd(), 'docs', filePath);
    const normalizedPath = path.normalize(safePath);
    const docsPath = path.normalize(path.join(process.cwd(), 'docs'));
    
    if (!normalizedPath.startsWith(docsPath)) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Read and return file content
    const content = await fs.readFile(normalizedPath, 'utf-8');
    res.json({ content, path: filePath });
    
  } catch (error) {
    console.error("Error reading documentation file:", error);
    res.status(404).json({ message: "Documentation file not found" });
  }
});
```

**Advanced Patterns:**
- **Dynamic imports**: Load modules only when needed
- **File system operations**: Safely read files with validation
- **Query parameters**: Handle optional and required parameters
- **Path security**: Prevent directory traversal attacks

## Testing Your Routes

### 1. Using curl

```bash
# Test GET endpoint
curl http://localhost:5000/api/examples

# Test GET with parameter
curl http://localhost:5000/api/examples/1

# Test POST endpoint
curl -X POST http://localhost:5000/api/examples \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Example","description":"A test example"}'
```

### 2. Using Browser Dev Tools

```javascript
// In browser console
fetch('/api/examples')
  .then(response => response.json())
  .then(data => console.log(data));

// POST request
fetch('/api/examples', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Example',
    description: 'Created from browser'
  })
}).then(response => response.json())
  .then(data => console.log(data));
```

## Common Patterns Summary

### RESTful Conventions
- `GET /api/resource` - List all resources
- `GET /api/resource/:id` - Get specific resource
- `POST /api/resource` - Create new resource
- `PUT /api/resource/:id` - Update entire resource
- `PATCH /api/resource/:id` - Update part of resource
- `DELETE /api/resource/:id` - Delete resource

### Response Structure
```typescript
// Success response
{
  "id": 1,
  "title": "Example",
  "data": { /* resource data */ }
}

// Error response
{
  "message": "Error description",
  "errors": [/* validation errors */]
}
```

### Status Code Guidelines
- `2xx` - Success
- `4xx` - Client error (bad request, validation, etc.)
- `5xx` - Server error (database down, unexpected errors)

This route system provides a solid foundation for building scalable, maintainable APIs that follow industry best practices and ensure type safety throughout the application.