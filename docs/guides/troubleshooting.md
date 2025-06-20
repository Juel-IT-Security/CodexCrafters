# Troubleshooting Guide

Common issues and solutions when developing with the AGENTS.md Educational Platform.

## Database Issues

### Connection Errors

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL environment variable
3. Verify connection credentials

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection manually
psql $DATABASE_URL
```

### Schema Sync Issues

**Problem:** Tables not found or schema mismatch

**Solution:**
```bash
# Push schema changes to database
npm run db:push

# If still having issues, check schema file
cat shared/schema.ts
```

### Migration Errors

**Problem:** Drizzle migration fails

**Solution:**
1. Check for syntax errors in schema
2. Ensure all imports are correct
3. Verify foreign key references

```typescript
// Common schema issues to check:
export const examples = pgTable("examples", {
  // Ensure all fields have proper types
  tags: json("tags").$type<string[]>().default([]), // Correct
  // tags: json("tags").$type<string[]>(), // May cause issues
});
```

## TypeScript Compilation Errors

### Module Resolution

**Problem:** `Cannot find module '@/components/ui/button'`

**Solution:**
Check `tsconfig.json` paths configuration:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

### Type Errors in Forms

**Problem:** Form validation type mismatches

**Solution:**
Ensure form schema matches database schema:

```typescript
// Correct: Use the insert schema
const form = useForm<InsertExample>({
  resolver: zodResolver(insertExampleSchema),
});

// Incorrect: Using select type for inserts
const form = useForm<Example>({ // This will cause type errors
  resolver: zodResolver(insertExampleSchema),
});
```

### Drizzle Type Issues

**Problem:** Database query type errors

**Solution:**
1. Regenerate Drizzle types: `npm run db:push`
2. Check schema exports are correct
3. Verify import paths

```typescript
// Ensure proper imports
import { db } from "./db";
import { examples } from "@shared/schema";
import { eq } from "drizzle-orm";

// Use proper query syntax
const example = await db.select().from(examples).where(eq(examples.id, id));
```

## React/Frontend Issues

### Component Import Errors

**Problem:** `Module not found: Can't resolve '@/components/ui/card'`

**Solution:**
1. Check if component exists in `client/src/components/ui/`
2. Verify import path is correct
3. Ensure component is properly exported

```typescript
// Check component export
export { Card, CardContent, CardDescription, CardHeader, CardTitle };

// Use correct import
import { Card, CardContent } from "@/components/ui/card";
```

### Hook Dependency Warnings

**Problem:** React Hook dependency warnings

**Solution:**
Add missing dependencies to useEffect arrays:

```typescript
// Problem: Missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId missing from dependencies

// Solution: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Or use useCallback for functions
const fetchData = useCallback((id: string) => {
  // fetch logic
}, []);
```

### State Update Errors

**Problem:** "Cannot update a component while rendering another component"

**Solution:**
Move state updates to event handlers or useEffect:

```typescript
// Problem: State update during render
function Component() {
  if (someCondition) {
    setState(newValue); // This causes the error
  }
  return <div>...</div>;
}

// Solution: Use useEffect
function Component() {
  useEffect(() => {
    if (someCondition) {
      setState(newValue);
    }
  }, [someCondition]);
  
  return <div>...</div>;
}
```

## API Issues

### CORS Errors

**Problem:** Cross-origin request blocked

**Solution:**
CORS is already configured in development. If issues persist:

```typescript
// Check server/index.ts for CORS setup
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://yourdomain.com"] 
    : true,
  credentials: true,
}));
```

### Request Validation Failures

**Problem:** 400 Bad Request with validation errors

**Solution:**
Check request payload matches expected schema:

```typescript
// Debug request payload
console.log("Request body:", req.body);
console.log("Validation result:", insertExampleSchema.safeParse(req.body));

// Common validation issues:
// 1. Missing required fields
// 2. Wrong data types
// 3. Extra unexpected fields
```

### 500 Internal Server Errors

**Problem:** Server crashes on API requests

**Solution:**
1. Check server logs for error details
2. Add proper error handling
3. Verify database operations

```typescript
// Add error logging
app.post("/api/examples", async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.error("API Error:", error); // Add this
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## Package Manager Issues

### Dependency Conflicts

**Problem:** npm install fails with peer dependency warnings

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For persistent issues, use --legacy-peer-deps
npm install --legacy-peer-deps
```

### Missing Dependencies

**Problem:** Module not found errors for installed packages

**Solution:**
1. Verify package is in package.json
2. Restart development server
3. Check import syntax

```bash
# Restart development server
npm run dev

# Check if package is actually installed
npm list packagename
```

## Development Server Issues

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in package.json
"dev": "PORT=3001 NODE_ENV=development tsx server/index.ts"
```

### Hot Reload Not Working

**Problem:** Changes not reflected in browser

**Solution:**
1. Check if files are saved
2. Restart development server
3. Clear browser cache
4. Check file permissions

```bash
# Restart development server
npm run dev

# Clear browser cache (Cmd/Ctrl + Shift + R)
```

## Performance Issues

### Slow Database Queries

**Problem:** API responses are slow

**Solution:**
1. Add database indexes
2. Optimize queries
3. Use query profiling

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_examples_project_type ON examples(project_type);
CREATE INDEX idx_examples_tags ON examples USING GIN (tags);

-- Profile slow queries
EXPLAIN ANALYZE SELECT * FROM examples WHERE project_type = 'Frontend';
```

### Large Bundle Size

**Problem:** Frontend loads slowly

**Solution:**
1. Implement code splitting
2. Optimize imports
3. Remove unused dependencies

```typescript
// Use lazy loading for routes
const HomePage = lazy(() => import("./pages/home"));

// Optimize imports - import only what you need
import { Button } from "@/components/ui/button"; // Good
import * as UI from "@/components/ui"; // Avoid this
```

## Environment Issues

### Environment Variables Not Loading

**Problem:** process.env variables are undefined

**Solution:**
1. Check .env file exists and has correct format
2. Restart development server
3. Verify variable names

```bash
# .env file format (no spaces around =)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NODE_ENV=development

# Frontend variables need VITE_ prefix
VITE_API_URL=http://localhost:5000
```

### Docker Issues (if using)

**Problem:** Container startup failures

**Solution:**
```bash
# Check container logs
docker logs container_name

# Rebuild container
docker-compose down
docker-compose up --build

# Clear Docker cache
docker system prune -a
```

## Debugging Tips

### Enable Debug Logging

```typescript
// Add debug logging to API routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Add query logging to Drizzle
export const db = drizzle({ 
  client: pool, 
  schema,
  logger: true // Enable query logging
});
```

### Use Browser DevTools

1. **Network Tab** - Check API requests and responses
2. **Console Tab** - Look for JavaScript errors
3. **Elements Tab** - Inspect DOM and styles
4. **Application Tab** - Check localStorage and cookies

### Database Debugging

```sql
-- Check table structure
\d examples

-- View recent records
SELECT * FROM examples ORDER BY id DESC LIMIT 5;

-- Check for data issues
SELECT COUNT(*) FROM examples WHERE tags IS NULL;
```

## Getting Help

When troubleshooting fails:

1. **Check Documentation** - Review API docs and architecture guide
2. **Search Issues** - Look for similar problems in project issues
3. **Minimal Reproduction** - Create smallest possible example that shows the problem
4. **Provide Context** - Include error messages, code snippets, and environment details

### Useful Commands for Debugging

```bash
# Check TypeScript compilation
npm run check

# Test database connection
npm run db:push

# View all available scripts
npm run

# Check process running on port
lsof -i :5000

# View environment variables
printenv | grep DATABASE
```

Remember: Most issues have simple solutions. Check the basics first: file paths, imports, environment variables, and server status.