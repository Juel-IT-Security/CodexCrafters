# Understanding the Examples Gallery

## Goal
Learn how the examples gallery component works in our AGENTS.md platform, including data fetching, loading states, and rendering patterns.

## What You'll Learn
- How TanStack Query manages server state
- Loading state patterns with skeleton components
- Error handling in React components
- Responsive grid layouts with Tailwind CSS

## Code Walkthrough

### 1. The Main Gallery Component

```typescript
// client/src/components/examples-gallery.tsx
export default function ExamplesGallery() {
  // TanStack Query handles all the complexity of data fetching
  const { data: examples, isLoading, error } = useQuery({
    queryKey: ['/api/examples'], // Unique cache key
    queryFn: () => apiRequest<Example[]>('/examples'), // Actual fetch function
  });
```

**Key Concepts:**
- `useQuery` automatically handles caching, background refetching, and loading states
- The `queryKey` is used for caching - same key means same data
- TypeScript generics `<Example[]>` ensure type safety

### 2. Loading State with Skeletons

```typescript
if (isLoading) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

**Why This Pattern:**
- Shows immediate feedback while loading
- Maintains layout structure during loading
- Better UX than blank screens or spinners
- `[...Array(6)]` creates placeholder cards

### 3. Error Handling

```typescript
if (error) {
  return (
    <div className="text-center">
      <p className="text-lg text-muted-foreground">
        Failed to load examples. Please try again later.
      </p>
    </div>
  );
}
```

**Error State Best Practices:**
- Always handle the error case
- Provide user-friendly messages
- Avoid technical error details
- Consider retry mechanisms

### 4. Data Rendering

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {examples?.map((example) => (
    <ExampleCard key={example.id} example={example} />
  ))}
</div>
```

**Rendering Patterns:**
- Optional chaining `examples?.map` handles undefined data
- Always use unique `key` props for list items
- Responsive grid adapts to screen size
- Component composition with `ExampleCard`

## How the API Integration Works

### 1. The API Request Function

```typescript
// client/src/lib/queryClient.ts
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

**Why This Pattern:**
- Generic function works with any endpoint
- TypeScript generics provide type safety
- Centralized error handling
- Consistent headers across all requests

### 2. Backend Route Handler

```typescript
// server/routes.ts
app.get("/api/examples", async (_req, res) => {
  try {
    const examples = await storage.getExamples();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch examples" });
  }
});
```

**Server Pattern:**
- Try-catch for error handling
- Consistent error response format
- Delegation to storage layer
- HTTP status codes for different scenarios

### 3. Database Storage Layer

```typescript
// server/storage.ts
async getExamples(): Promise<Example[]> {
  return await db.select().from(examples);
}
```

**Storage Pattern:**
- Simple, focused methods
- Promise-based async operations
- Type-safe with Drizzle ORM
- Clean separation of concerns

## Responsive Design Implementation

### Grid System
```css
/* Tailwind classes breakdown */
grid grid-cols-1    /* 1 column on mobile */
md:grid-cols-2      /* 2 columns on medium screens */
lg:grid-cols-3      /* 3 columns on large screens */
gap-8               /* Consistent spacing */
```

### Card Layout
```typescript
<Card className="overflow-hidden">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

**Design Principles:**
- Consistent card structure
- Semantic HTML with proper headings
- Overflow handling for long content
- Accessible color contrast

## Data Flow Summary

1. **Component Mounts** → `useQuery` triggers
2. **API Request** → `apiRequest('/examples')` called
3. **Server Route** → `/api/examples` handler executes
4. **Database Query** → `storage.getExamples()` fetches data
5. **Response** → Data flows back through the chain
6. **React Update** → Component re-renders with data

## Key Learning Points

### State Management
- Server state is different from local state
- TanStack Query handles server state automatically
- Loading and error states are essential for good UX

### Component Architecture
- Single responsibility - gallery only displays data
- Composition over inheritance
- TypeScript interfaces for data contracts

### Performance Considerations
- Automatic caching prevents unnecessary requests
- Background refetching keeps data fresh
- Skeleton loading maintains visual stability

## Try It Yourself

1. **Add Search**: Modify the gallery to filter examples based on user input
2. **Add Sorting**: Allow users to sort by title, date, or project type
3. **Add Pagination**: Handle large datasets with page-based loading
4. **Add Refresh**: Add a manual refresh button

## Related Concepts

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Loading States Pattern](../../CODE_CONCEPTS.md#loading-states)
- [Error Handling](../../CODE_CONCEPTS.md#error-boundaries)