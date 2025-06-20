# Architecture Guide

This document explains the architectural decisions and patterns used in the AGENTS.md Educational Platform, helping you understand how to build scalable full-stack applications.

## Overall Architecture

The platform follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│     Layer       │◄──►│     Layer       │◄──►│     Layer       │
│   (React SPA)   │    │ (Express API)   │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Architectural Principles

1. **Single Responsibility** - Each component has one clear purpose
2. **Dependency Inversion** - High-level modules don't depend on low-level modules
3. **Interface Segregation** - Small, focused interfaces over large ones
4. **Type Safety** - TypeScript throughout the entire stack
5. **Data Consistency** - Shared schemas between frontend and backend

## Frontend Architecture

### Component Structure

```
client/src/
├── components/
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── hero-section.tsx # Feature-specific components
│   ├── navigation.tsx   # Layout components
│   └── ...
├── pages/               # Route-level components
├── hooks/               # Custom React hooks
└── lib/                 # Utilities and configurations
```

### State Management Strategy

**Local State (useState)**
- Component-specific UI state
- Form inputs and validation
- Modal open/close states

**Server State (TanStack Query)**
- API data fetching and caching
- Background refetching
- Optimistic updates

**Global State (Context + useReducer)**
- User authentication
- Theme preferences
- Application-wide settings

### Data Flow Pattern

```
API Call → TanStack Query → React Component → UI Update
    ↑                                              ↓
Cache Management ←─── User Interaction ←─── Event Handler
```

## Backend Architecture

### Layered Architecture

```
┌─────────────────┐
│   Routes Layer  │  ← HTTP endpoints, request validation
├─────────────────┤
│ Business Layer  │  ← Application logic, orchestration
├─────────────────┤
│  Storage Layer  │  ← Data access, database operations
├─────────────────┤
│ Database Layer  │  ← PostgreSQL, constraints, indexes
└─────────────────┘
```

### Core Components

**Routes (`server/routes.ts`)**
- HTTP endpoint definitions
- Request/response handling
- Input validation with Zod schemas
- Error handling middleware

**Storage Interface (`server/storage.ts`)**
- Abstraction over database operations
- Type-safe CRUD operations
- Business logic implementation
- Data transformation

**Database Layer (`server/db.ts`)**
- Connection management
- Drizzle ORM configuration
- Query optimization
- Transaction handling

### Request Lifecycle

```
HTTP Request → Route Handler → Validation → Storage Layer → Database → Response
                     ↓              ↓            ↓           ↓
                Error Handler ← Validation ← Business ← Database
                     ↓         Error      Logic     Error
                HTTP Response              Error
```

## Database Design

### Schema Organization

```sql
-- Core entities
Examples (projects with generated AGENTS.md)
├── id (primary key)
├── title, description
├── project_type
├── repository_structure
├── generated_agents_md
└── tags (JSON array)

Guides (tutorial content)
├── id (primary key)
├── title, description
├── video_url (optional)
├── thumbnail_color
└── category
```

### Design Principles

1. **Normalization** - Minimize data redundancy
2. **Constraints** - Enforce data integrity at database level
3. **Indexing** - Optimize for common query patterns
4. **JSON Fields** - Flexible storage for arrays and objects
5. **Type Safety** - Drizzle ORM provides compile-time validation

## Shared Schema Pattern

### Type Definition Strategy

```typescript
// 1. Define database schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});

// 2. Generate insert schema
export const insertUserSchema = createInsertSchema(users).omit({
  id: true, // Auto-generated fields
});

// 3. Create TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
```

### Benefits

- **Single Source of Truth** - Schema defined once, used everywhere
- **Type Safety** - Compile-time validation across frontend and backend
- **Validation** - Runtime validation with Zod schemas
- **IntelliSense** - Full IDE support for database operations

## API Design Patterns

### RESTful Conventions

```
GET    /api/examples     # List all examples
GET    /api/examples/:id # Get specific example
POST   /api/examples     # Create new example
PUT    /api/examples/:id # Update example
DELETE /api/examples/:id # Delete example
```

### Error Handling Strategy

```typescript
// Consistent error responses
interface ApiError {
  error: string;
  details?: string[];
  code?: string;
}

// HTTP status codes
200 OK           - Successful operation
201 Created      - Resource created
400 Bad Request  - Validation error
404 Not Found    - Resource not found
500 Server Error - Internal error
```

### Request/Response Flow

```typescript
// 1. Route handler with validation
app.post("/api/examples", async (req, res) => {
  const result = insertExampleSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: "Validation failed",
      details: result.error.errors
    });
  }
  
  try {
    const example = await storage.createExample(result.data);
    res.status(201).json(example);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## Frontend-Backend Integration

### Type-Safe API Calls

```typescript
// Frontend API utility
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
```

### Query Integration

```typescript
// TanStack Query hook
export function useExamples() {
  return useQuery({
    queryKey: ['/api/examples'],
    queryFn: () => apiRequest<Example[]>('/examples'),
  });
}

// Component usage
export function ExamplesList() {
  const { data: examples, isLoading, error } = useExamples();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {examples?.map(example => (
        <ExampleCard key={example.id} example={example} />
      ))}
    </div>
  );
}
```

## Performance Considerations

### Frontend Optimization

- **Code Splitting** - Lazy load route components
- **Memoization** - React.memo for expensive components
- **Query Caching** - TanStack Query automatic caching
- **Bundle Optimization** - Tree shaking and minification

### Backend Optimization

- **Database Indexing** - Index frequently queried columns
- **Query Optimization** - Use Drizzle's efficient query builder
- **Connection Pooling** - Reuse database connections
- **Response Compression** - Gzip middleware

### Database Optimization

```sql
-- Index for common queries
CREATE INDEX idx_examples_project_type ON examples(project_type);
CREATE INDEX idx_guides_category ON guides(category);

-- Efficient JSON queries
CREATE INDEX idx_examples_tags ON examples USING GIN (tags);
```

## Security Patterns

### Input Validation

```typescript
// Zod schema validation
const createExampleSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  projectType: z.enum(['Frontend', 'Backend', 'Full Stack']),
  tags: z.array(z.string()).max(10).optional(),
});
```

### SQL Injection Prevention

```typescript
// Drizzle ORM prevents SQL injection
const examples = await db
  .select()
  .from(examplesTable)
  .where(eq(examplesTable.id, userId)); // Parameterized query
```

## Testing Strategy

### Unit Testing

- **Components** - React Testing Library
- **Utilities** - Jest for pure functions
- **API Routes** - Supertest for endpoint testing
- **Database** - In-memory testing database

### Integration Testing

- **API Endpoints** - Full request/response cycle
- **Database Operations** - Real database operations
- **Frontend Flows** - User interaction testing

### End-to-End Testing

- **User Journeys** - Complete application workflows
- **Browser Testing** - Cross-browser compatibility
- **Performance Testing** - Load testing and profiling

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Frontend (Vite dev server)
├── Backend (tsx watch mode)
└── Database (local PostgreSQL)
```

### Production Environment

```
Cloud Platform
├── Frontend (Static files served by CDN)
├── Backend (Node.js server)
├── Database (Managed PostgreSQL)
└── Monitoring (Logs, metrics, alerts)
```

## Best Practices

### Code Organization

1. **Feature-based structure** - Group related files together
2. **Consistent naming** - Use clear, descriptive names
3. **Type definitions** - Define types close to usage
4. **Error boundaries** - Handle errors gracefully
5. **Documentation** - Comment complex logic

### Development Workflow

1. **Schema first** - Design data model before implementation
2. **API design** - Define endpoints before frontend work
3. **Type safety** - Use TypeScript throughout
4. **Testing** - Write tests alongside implementation
5. **Incremental development** - Small, focused changes

This architecture provides a solid foundation for building scalable, maintainable full-stack applications while teaching modern development practices.