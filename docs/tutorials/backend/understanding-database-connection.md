# Understanding Database Connection

## Overview

Database connection setup is critical for any backend application. This tutorial covers PostgreSQL connection configuration using Neon serverless database with Drizzle ORM, including connection pooling, error handling, and environment configuration.

## What You'll Learn

- Serverless database connection patterns
- Environment variable configuration
- Connection pooling strategies
- WebSocket configuration for serverless environments
- Error handling for database connectivity

## Database Connection Architecture

### 1. Basic Connection Setup

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

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

**Key Components:**
- **Neon Configuration**: WebSocket setup for serverless compatibility
- **Environment Validation**: Ensures DATABASE_URL is configured
- **Connection Pool**: Manages multiple database connections
- **Drizzle Instance**: ORM configured with schema for type safety

### 2. Environment Configuration

```typescript
// Environment variable structure
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

// Development vs Production
if (process.env.NODE_ENV === 'development') {
  // Development database
  DATABASE_URL="postgresql://dev_user:dev_pass@localhost:5432/dev_db"
} else {
  // Production database (Neon, Supabase, etc.)
  DATABASE_URL="postgresql://prod_user:prod_pass@prod-host:5432/prod_db?sslmode=require"
}
```

## Connection Pooling

### 1. Pool Configuration

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout if can't get connection in 2s
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

**Pool Benefits:**
- **Performance**: Reuses existing connections
- **Resource Management**: Limits concurrent connections
- **Automatic Cleanup**: Closes idle connections
- **Error Recovery**: Handles connection failures gracefully

### 2. Connection Lifecycle

```typescript
// Connection flow
1. Application starts → Pool created with initial connections
2. Query requested → Pool provides available connection
3. Query completed → Connection returned to pool
4. Idle timeout → Unused connections closed
5. Application shutdown → All connections closed
```

## Serverless Database Considerations

### 1. WebSocket Configuration

```typescript
import ws from "ws";
import { neonConfig } from '@neondatabase/serverless';

// Required for serverless environments
neonConfig.webSocketConstructor = ws;

// Alternative configurations
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// For edge runtime environments
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = ws as any;
}
```

### 2. Cold Start Optimization

```typescript
// Lazy connection initialization
let dbInstance: ReturnType<typeof drizzle> | null = null;

export const getDB = () => {
  if (!dbInstance) {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1, // Smaller pool for serverless
      connectionTimeoutMillis: 5000
    });
    dbInstance = drizzle({ client: pool, schema });
  }
  return dbInstance;
};

// Usage
const db = getDB();
const users = await db.select().from(usersTable);
```

## Error Handling

### 1. Connection Error Handling

```typescript
const createDatabaseConnection = () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test connection
    pool.connect((err, client, release) => {
      if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
      }
      console.log('Database connected successfully');
      release();
    });

    return drizzle({ client: pool, schema });
  } catch (error) {
    console.error('Failed to create database connection:', error);
    process.exit(1);
  }
};
```

### 2. Query Error Handling

```typescript
const safeQuery = async <T>(queryFn: () => Promise<T>): Promise<T | null> => {
  try {
    return await queryFn();
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Database connection refused');
    } else if (error.code === '28P01') {
      console.error('Invalid database credentials');
    } else if (error.code === '3D000') {
      console.error('Database does not exist');
    } else {
      console.error('Database query failed:', error);
    }
    return null;
  }
};

// Usage
const examples = await safeQuery(() => db.select().from(examplesTable));
```

## Schema Integration

### 1. Schema Import

```typescript
// Importing all schema definitions
import * as schema from "@shared/schema";

const db = drizzle({ client: pool, schema });

// Now db has type-safe access to all tables
const examples = await db.select().from(schema.examples);
const guides = await db.select().from(schema.guides);
```

### 2. Query Builder with Schema

```typescript
// Type-safe queries with imported schema
export const dbQueries = {
  async getAllExamples() {
    return await db.select().from(schema.examples);
  },

  async getExampleById(id: number) {
    return await db
      .select()
      .from(schema.examples)
      .where(eq(schema.examples.id, id));
  },

  async createExample(data: InsertExample) {
    return await db
      .insert(schema.examples)
      .values(data)
      .returning();
  }
};
```

## Database Migrations

### 1. Drizzle Kit Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 2. Migration Commands

```bash
# Generate migrations
npx drizzle-kit generate

# Push schema changes (development)
npx drizzle-kit push

# Apply migrations (production)
npx drizzle-kit migrate
```

## Environment-Specific Configuration

### 1. Development Setup

```typescript
// Development with local PostgreSQL
const devConfig = {
  connectionString: "postgresql://localhost:5432/agents_md_dev",
  ssl: false,
  max: 5, // Smaller pool for development
  idleTimeoutMillis: 10000
};
```

### 2. Production Setup

```typescript
// Production with Neon/Supabase
const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
};
```

### 3. Testing Setup

```typescript
// Test database configuration
const testConfig = {
  connectionString: process.env.TEST_DATABASE_URL || "postgresql://localhost:5432/agents_md_test",
  ssl: false,
  max: 2, // Minimal connections for testing
  idleTimeoutMillis: 5000
};
```

## Connection Monitoring

### 1. Health Checks

```typescript
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Health check endpoint
app.get('/health/database', async (req, res) => {
  const isHealthy = await checkDatabaseHealth();
  
  if (isHealthy) {
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } else {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});
```

### 2. Connection Metrics

```typescript
const connectionMetrics = {
  totalConnections: 0,
  activeConnections: 0,
  failedConnections: 0,
  averageQueryTime: 0
};

// Middleware to track metrics
const trackConnection = (originalQuery: Function) => {
  return async (...args: any[]) => {
    const startTime = Date.now();
    connectionMetrics.activeConnections++;
    
    try {
      const result = await originalQuery(...args);
      const queryTime = Date.now() - startTime;
      connectionMetrics.averageQueryTime = 
        (connectionMetrics.averageQueryTime + queryTime) / 2;
      return result;
    } catch (error) {
      connectionMetrics.failedConnections++;
      throw error;
    } finally {
      connectionMetrics.activeConnections--;
    }
  };
};
```

## Troubleshooting Common Issues

### 1. Connection String Format

```typescript
// Correct format
"postgresql://username:password@hostname:port/database?param=value"

// Common issues
"postgres://..."     // Should be "postgresql://"
"...?ssl=true"       // Should be "?sslmode=require"
"localhost:5432"     // Missing protocol and credentials
```

### 2. SSL Configuration

```typescript
// For cloud databases (production)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for most cloud providers
  }
});

// For local development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL for local development
});
```

### 3. Timeout Issues

```typescript
// Adjust timeouts for slow connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 60000, // 1 minute
  query_timeout: 30000 // 30 seconds for queries
});
```

## Performance Optimization

### 1. Connection Pool Sizing

```typescript
// Calculate optimal pool size
const optimalPoolSize = Math.max(
  5, // Minimum connections
  Math.min(
    20, // Maximum connections
    Math.floor(process.env.MAX_CONNECTIONS / 2) // Half of max DB connections
  )
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: optimalPoolSize
});
```

### 2. Query Caching

```typescript
// Simple query result caching
const queryCache = new Map();

const cachedQuery = async (key: string, queryFn: () => Promise<any>, ttl = 60000) => {
  const cached = queryCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const data = await queryFn();
  queryCache.set(key, { data, timestamp: Date.now() });
  
  return data;
};

// Usage
const examples = await cachedQuery('all-examples', () => 
  db.select().from(schema.examples)
);
```

## Testing Database Connections

### 1. Unit Tests

```typescript
import { createTestDatabase, cleanupTestDatabase } from './test-utils';

describe('Database Connection', () => {
  beforeAll(async () => {
    await createTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('should connect to database successfully', async () => {
    const result = await db.execute(sql`SELECT 1 as test`);
    expect(result.rows[0].test).toBe(1);
  });

  test('should handle connection errors gracefully', async () => {
    const invalidDb = drizzle({ 
      client: new Pool({ connectionString: 'invalid://connection' }) 
    });

    await expect(invalidDb.execute(sql`SELECT 1`)).rejects.toThrow();
  });
});
```

### 2. Integration Tests

```typescript
test('database operations work end-to-end', async () => {
  // Create test data
  const [example] = await db
    .insert(schema.examples)
    .values({
      title: 'Test Example',
      description: 'Test description',
      projectType: 'Frontend',
      repositoryStructure: 'test',
      generatedAgentsMd: 'test',
      tags: ['test']
    })
    .returning();

  // Verify creation
  expect(example.id).toBeDefined();
  expect(example.title).toBe('Test Example');

  // Verify retrieval
  const retrieved = await db
    .select()
    .from(schema.examples)
    .where(eq(schema.examples.id, example.id));

  expect(retrieved).toHaveLength(1);
  expect(retrieved[0].title).toBe('Test Example');
});
```

## Key Learning Points

### Database Connection Benefits
- **Type Safety**: Full TypeScript integration with Drizzle ORM
- **Performance**: Connection pooling for optimal resource usage
- **Reliability**: Proper error handling and connection recovery
- **Scalability**: Serverless-compatible configuration

### Best Practices
- Always validate environment variables before connection
- Use connection pooling for better performance
- Implement proper error handling and logging
- Configure SSL appropriately for environment
- Monitor connection health and metrics

### Security Considerations
- Store connection strings in environment variables
- Use SSL for production databases
- Implement connection timeouts
- Validate database credentials
- Monitor for suspicious connection patterns

This database connection setup provides a robust foundation for building scalable, maintainable applications with excellent performance and reliability.