# Understanding Full-Stack Data Flow

## Goal
Learn how data flows through our AGENTS.md platform from database to user interface, understanding each layer's responsibility and how they work together.

## What You'll Learn
- Complete request lifecycle from browser to database
- How each layer transforms and validates data
- Error handling at each step
- Type safety throughout the entire stack

## The Complete Data Flow

### 1. User Interaction to API Request

```typescript
// client/src/components/examples-gallery.tsx
export default function ExamplesGallery() {
  // Step 1: Component mounts, TanStack Query triggers data fetch
  const { data: examples, isLoading, error } = useQuery({
    queryKey: ['/api/examples'], // Cache key for this specific request
    queryFn: () => apiRequest<Example[]>('/examples'), // Function that makes the actual request
  });
```

**What Happens Here:**
- Component renders and useQuery automatically starts
- TanStack Query checks cache first
- If no cached data, calls apiRequest function
- Loading state is managed automatically

### 2. API Request Function

```typescript
// client/src/lib/queryClient.ts
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Step 2: Build full URL and add headers
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  // Step 3: Check if response is successful
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  // Step 4: Parse JSON and return typed data
  return response.json();
}
```

**Key Functions:**
- Builds complete API URL (`/api/examples`)
- Adds consistent headers
- Handles HTTP errors
- Returns typed data with TypeScript generics

### 3. Express Route Handler

```typescript
// server/routes.ts
app.get("/api/examples", async (_req, res) => {
  try {
    // Step 5: Route receives request and delegates to storage
    const examples = await storage.getExamples();
    
    // Step 6: Send successful response
    res.json(examples);
  } catch (error) {
    // Step 7: Handle any errors that occur
    res.status(500).json({ message: "Failed to fetch examples" });
  }
});
```

**Route Responsibilities:**
- Receives HTTP requests
- Delegates business logic to storage layer
- Handles errors and sends appropriate responses
- Maintains consistent error format

### 4. Storage Layer

```typescript
// server/storage.ts
export class DatabaseStorage implements IStorage {
  async getExamples(): Promise<Example[]> {
    // Step 8: Execute database query
    return await db.select().from(examples);
  }
}
```

**Storage Pattern:**
- Implements interface for consistency
- Uses Drizzle ORM for type-safe queries
- Returns Promise for async operations
- Simple, focused methods

### 5. Database Layer

```typescript
// server/db.ts
// Step 9: Database connection and query execution
export const db = drizzle({ client: pool, schema });

// The actual SQL query generated:
// SELECT * FROM examples;
```

**Database Features:**
- Connection pooling for performance
- Schema-aware queries
- Automatic type inference
- SQL generation from TypeScript

## Data Transformation Flow

### Request Direction (Frontend → Backend → Database)

```
User Clicks → useQuery → apiRequest → Route Handler → Storage → Database
    ↓            ↓          ↓            ↓            ↓        ↓
  Event      Cache Key   HTTP Req    Validation   Query    SQL
```

### Response Direction (Database → Backend → Frontend)

```
SQL Result → Storage → Route Handler → HTTP Response → apiRequest → useQuery → Component
    ↓          ↓           ↓              ↓             ↓          ↓         ↓
  Raw Data   Typed     JSON Response   Parsed JSON   Cached    State     UI Update
```

## Type Safety Throughout the Stack

### 1. Database Schema to Types

```typescript
// shared/schema.ts
export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  // ... other fields
});

// Automatic type inference
export type Example = typeof examples.$inferSelect;
// Result: { id: number; title: string; ... }
```

### 2. Storage Layer Types

```typescript
// server/storage.ts
async getExamples(): Promise<Example[]> {
  // Return type is enforced by TypeScript
  return await db.select().from(examples);
}
```

### 3. API Layer Types

```typescript
// server/routes.ts
const examples = await storage.getExamples(); // Type: Example[]
res.json(examples); // Express knows it's sending Example[]
```

### 4. Frontend Types

```typescript
// client/src/components/examples-gallery.tsx
const { data: examples } = useQuery({
  queryFn: () => apiRequest<Example[]>('/examples'), // Explicit typing
});
// examples is typed as Example[] | undefined
```

## Error Handling at Each Layer

### 1. Database Errors

```typescript
// server/storage.ts
async getExamples(): Promise<Example[]> {
  try {
    return await db.select().from(examples);
  } catch (dbError) {
    // Database connection issues, syntax errors, etc.
    throw new Error('Database query failed');
  }
}
```

### 2. Storage Layer Errors

```typescript
// server/routes.ts
app.get("/api/examples", async (_req, res) => {
  try {
    const examples = await storage.getExamples();
    res.json(examples);
  } catch (error) {
    // Storage errors become HTTP 500 responses
    res.status(500).json({ message: "Failed to fetch examples" });
  }
});
```

### 3. Network Errors

```typescript
// client/src/lib/queryClient.ts
export async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`/api${endpoint}`);
  
  if (!response.ok) {
    // HTTP errors (4xx, 5xx) become JavaScript errors
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
```

### 4. React Error Boundaries

```typescript
// client/src/components/examples-gallery.tsx
const { data: examples, isLoading, error } = useQuery({
  queryKey: ['/api/examples'],
  queryFn: () => apiRequest<Example[]>('/examples'),
});

// TanStack Query catches errors automatically
if (error) {
  return <div>Failed to load examples</div>;
}
```

## Caching and Performance

### 1. TanStack Query Cache

```typescript
// Automatic caching by query key
const { data } = useQuery({
  queryKey: ['/api/examples'], // Same key = same cached data
  queryFn: () => apiRequest<Example[]>('/examples'),
  staleTime: 5 * 60 * 1000, // 5 minutes before refetch
});
```

### 2. Database Connection Pooling

```typescript
// server/db.ts
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum 20 concurrent connections
});
```

### 3. HTTP Response Caching

```typescript
// Express can add cache headers
app.get("/api/examples", async (_req, res) => {
  const examples = await storage.getExamples();
  
  // Cache for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  res.json(examples);
});
```

## Real-World Example: Adding a New Field

To add a "difficulty" field to examples, changes are needed at each layer:

### 1. Database Schema

```typescript
// shared/schema.ts
export const examples = pgTable("examples", {
  // ... existing fields
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }),
});
```

### 2. Database Migration

```bash
npm run db:push  # Drizzle pushes schema changes
```

### 3. Storage Layer (No Changes Needed)

```typescript
// server/storage.ts
// getExamples() automatically returns new field
```

### 4. API Layer (No Changes Needed)

```typescript
// server/routes.ts
// Route automatically includes new field in response
```

### 5. Frontend Updates

```typescript
// client/src/components/example-card.tsx
export function ExampleCard({ example }: { example: Example }) {
  return (
    <Card>
      {/* Existing content */}
      {example.difficulty && (
        <Badge variant="outline">{example.difficulty}</Badge>
      )}
    </Card>
  );
}
```

## Performance Monitoring

### 1. Database Query Performance

```typescript
// Enable query logging in development
export const db = drizzle({ 
  client: pool, 
  schema,
  logger: process.env.NODE_ENV === 'development'
});
```

### 2. API Response Times

```typescript
// Add timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});
```

### 3. React Performance

```typescript
// Monitor slow components
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 100) {
    console.log('Slow render:', id, actualDuration);
  }
}

<Profiler id="ExamplesGallery" onRender={onRenderCallback}>
  <ExamplesGallery />
</Profiler>
```

## Key Learning Points

### Architecture Benefits
- Clear separation of concerns
- Type safety prevents runtime errors
- Each layer has single responsibility
- Easy to test individual components

### Data Flow Patterns
- Unidirectional data flow
- Predictable state management
- Automatic error propagation
- Consistent error handling

### Performance Strategies
- Caching at multiple levels
- Connection pooling
- Background data fetching
- Optimistic UI updates

## Common Patterns

### Loading States
```typescript
// Always handle loading state
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage />;
return <DataDisplay data={data} />;
```

### Error Boundaries
```typescript
// Wrap components in error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <ExamplesGallery />
</ErrorBoundary>
```

### Type Guards
```typescript
// Validate data shape at runtime
function isExample(obj: any): obj is Example {
  return obj && typeof obj.id === 'number' && typeof obj.title === 'string';
}
```

This data flow architecture enables scalable, maintainable applications with predictable behavior and excellent developer experience.