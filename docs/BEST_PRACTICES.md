# Development Best Practices

Essential guidelines for writing maintainable, scalable code in modern full-stack applications.

## Code Organization

### File Structure

**Group by Feature, Not by Type**
```
// Good: Feature-based organization
components/
├── auth/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── auth-context.tsx
├── dashboard/
│   ├── dashboard-layout.tsx
│   ├── stats-card.tsx
│   └── activity-feed.tsx

// Avoid: Type-based organization
components/
├── forms/
├── layouts/
├── contexts/
└── cards/
```

**Consistent Naming Conventions**
```typescript
// Components: PascalCase
export function UserProfile() {}

// Files: kebab-case
user-profile.tsx
api-client.ts
database-utils.ts

// Variables/Functions: camelCase
const userId = "123";
function fetchUserData() {}

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";
```

### Import Organization

```typescript
// 1. Node modules
import React from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Internal libraries
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

// 3. Relative imports
import { UserCard } from "./user-card";
import type { User } from "../types";
```

## TypeScript Best Practices

### Type Definitions

**Use Specific Types Over Generic Ones**
```typescript
// Good: Specific types
interface CreateUserRequest {
  email: string;
  name: string;
  role: "admin" | "user" | "moderator";
}

// Avoid: Generic types
interface CreateUserRequest {
  email: any;
  name: any;
  role: string;
}
```

**Leverage Type Inference**
```typescript
// Good: Let TypeScript infer when obvious
const users = await fetchUsers(); // Type inferred as User[]
const count = users.length; // Type inferred as number

// Avoid: Unnecessary explicit typing
const users: User[] = await fetchUsers();
const count: number = users.length;
```

**Use Utility Types**
```typescript
// Creating variations of existing types
type UpdateUser = Partial<CreateUser>; // All fields optional
type UserEmail = Pick<User, "email">; // Only email field
type UserWithoutId = Omit<User, "id">; // All fields except id
```

### Error Handling

**Result Pattern for API Calls**
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await apiRequest<User>(`/users/${id}`);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = await fetchUser("123");
if (result.success) {
  console.log(result.data.name); // TypeScript knows this is User
} else {
  console.error(result.error.message); // TypeScript knows this is Error
}
```

## React Patterns

### Component Design

**Single Responsibility Principle**
```typescript
// Good: Each component has one clear purpose
function UserAvatar({ user }: { user: User }) {
  return (
    <img 
      src={user.avatar} 
      alt={user.name}
      className="w-8 h-8 rounded-full"
    />
  );
}

function UserName({ user }: { user: User }) {
  return <span className="font-medium">{user.name}</span>;
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} />
      <UserName user={user} />
    </div>
  );
}
```

**Prop Interface Design**
```typescript
// Good: Clear, specific interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  showPrice?: boolean;
  variant?: "compact" | "detailed";
}

// Avoid: Unclear or overly generic props
interface ProductCardProps {
  data: any;
  onClick: () => void;
  options?: Record<string, unknown>;
}
```

### State Management

**Local State for UI, Server State for Data**
```typescript
function ProductList() {
  // Server state - managed by TanStack Query
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest<Product[]>('/products'),
  });

  // Local UI state - managed by useState
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isGridView, setIsGridView] = useState(true);

  const filteredProducts = useMemo(() => {
    return products?.filter(p => 
      selectedCategory === "all" || p.category === selectedCategory
    ) || [];
  }, [products, selectedCategory]);

  return (
    <div>
      <CategoryFilter 
        value={selectedCategory} 
        onChange={setSelectedCategory} 
      />
      <ViewToggle isGrid={isGridView} onChange={setIsGridView} />
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
```

**Custom Hooks for Reusable Logic**
```typescript
// Extract common patterns into custom hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, setStoredValue] as const;
}

// Usage
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [language, setLanguage] = useLocalStorage("language", "en");
  
  return (
    <div>
      <ThemeToggle value={theme} onChange={setTheme} />
      <LanguageSelect value={language} onChange={setLanguage} />
    </div>
  );
}
```

## Database Best Practices

### Schema Design

**Normalize Data Structure**
```typescript
// Good: Normalized schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Avoid: Denormalized data duplication
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: integer("author_id"),
  authorName: text("author_name"), // Duplicated data
  authorEmail: text("author_email"), // Duplicated data
});
```

**Use Appropriate Data Types**
```typescript
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }), // For money
  isActive: boolean("is_active").default(true),
  tags: json("tags").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Query Optimization

**Use Indexes for Common Queries**
```sql
-- Index frequently queried columns
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_products_category ON products(category);

-- Composite indexes for multi-column queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- GIN indexes for JSON/array queries
CREATE INDEX idx_products_tags ON products USING GIN (tags);
```

**Efficient Query Patterns**
```typescript
// Good: Select only needed columns
const users = await db
  .select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
  })
  .from(usersTable)
  .where(eq(usersTable.isActive, true));

// Avoid: Select all columns when not needed
const users = await db.select().from(usersTable);

// Good: Use pagination for large datasets
const posts = await db
  .select()
  .from(postsTable)
  .orderBy(desc(postsTable.createdAt))
  .limit(20)
  .offset(page * 20);
```

## API Design

### RESTful Conventions

**Resource-Based URLs**
```typescript
// Good: Resource-based endpoints
GET    /api/users          // List users
GET    /api/users/123      // Get specific user
POST   /api/users          // Create user
PUT    /api/users/123      // Update user
DELETE /api/users/123      // Delete user

// For nested resources
GET    /api/users/123/posts      // Get user's posts
POST   /api/users/123/posts      // Create post for user

// Avoid: Action-based URLs
GET    /api/getUsers
POST   /api/createUser
POST   /api/updateUser
```

**Consistent Error Responses**
```typescript
interface ApiError {
  error: string;
  code?: string;
  details?: string[];
  timestamp: string;
}

// Standard error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorResponse: ApiError = {
    error: err.message,
    code: err.name,
    timestamp: new Date().toISOString(),
  };

  if (err instanceof ValidationError) {
    res.status(400).json({
      ...errorResponse,
      details: err.details,
    });
  } else {
    res.status(500).json(errorResponse);
  }
});
```

### Input Validation

**Validate All Inputs**
```typescript
// Define validation schemas
const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().min(13, "Must be at least 13 years old"),
});

// Use in route handler
app.post("/api/users", async (req, res) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Process valid data
  const user = await storage.createUser(result.data);
  res.status(201).json(user);
});
```

## Security Best Practices

### Input Sanitization

```typescript
// Sanitize user inputs
import { escape } from "html-escaper";

function sanitizeUserInput(input: string): string {
  return escape(input.trim());
}

// Validate file uploads
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024; // 5MB

function validateFileUpload(file: Express.Multer.File): boolean {
  return allowedMimeTypes.includes(file.mimetype) && 
         file.size <= maxFileSize;
}
```

### Environment Variables

```typescript
// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Use environment-specific configurations
const config = {
  database: {
    url: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === "production",
  },
  server: {
    port: parseInt(process.env.PORT || "5000"),
    cors: {
      origin: process.env.NODE_ENV === "production" 
        ? process.env.ALLOWED_ORIGINS?.split(",") 
        : true,
    },
  },
};
```

## Performance Optimization

### Frontend Performance

**Component Optimization**
```typescript
// Use React.memo for expensive components
const ExpensiveUserList = React.memo(({ users }: { users: User[] }) => {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
});

// Use useMemo for expensive calculations
function UserAnalytics({ users }: { users: User[] }) {
  const statistics = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      averageAge: users.reduce((sum, u) => sum + u.age, 0) / users.length,
    };
  }, [users]);

  return <StatsDisplay stats={statistics} />;
}
```

**Code Splitting**
```typescript
// Lazy load route components
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Profile = lazy(() => import("./pages/profile"));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={Profile} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### Backend Performance

**Database Connection Pooling**
```typescript
// Configure connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Caching Strategies**
```typescript
// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();

function getCached<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item || Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache<T>(key: string, data: T, ttlMs = 60000): void {
  cache.set(key, {
    data,
    expires: Date.now() + ttlMs,
  });
}

// Use in API route
app.get("/api/popular-posts", async (req, res) => {
  const cacheKey = "popular-posts";
  let posts = getCached<Post[]>(cacheKey);
  
  if (!posts) {
    posts = await storage.getPopularPosts();
    setCache(cacheKey, posts, 5 * 60 * 1000); // 5 minutes
  }
  
  res.json(posts);
});
```

## Testing Best Practices

### Unit Testing

```typescript
// Test pure functions
describe("formatPrice", () => {
  it("formats USD currency correctly", () => {
    expect(formatPrice(1234.56, "USD")).toBe("$1,234.56");
  });

  it("handles zero amounts", () => {
    expect(formatPrice(0, "USD")).toBe("$0.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatPrice(1.999, "USD")).toBe("$2.00");
  });
});

// Test React components
import { render, screen, fireEvent } from "@testing-library/react";

describe("UserForm", () => {
  it("submits form with valid data", async () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "John Doe"
      });
    });
  });
});
```

Remember: Good practices are guidelines, not rigid rules. Adapt them to your specific context while maintaining consistency across your codebase.