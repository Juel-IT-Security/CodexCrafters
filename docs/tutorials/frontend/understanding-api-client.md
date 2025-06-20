# Understanding the API Client

## Overview

The API client is the bridge between your React frontend and Express backend. It handles HTTP requests, error management, and data caching using TanStack Query.

## What You'll Learn

- How to build a robust API client
- Error handling patterns for HTTP requests
- TanStack Query configuration and usage
- Type-safe data fetching patterns

## API Client Architecture

### 1. Core Request Function

```typescript
// client/src/lib/queryClient.ts
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });
  
  await throwIfResNotOk(res);
  return res;
}
```

**Key Features:**
- **Generic Method**: Works with GET, POST, PUT, DELETE
- **Content-Type Handling**: Only adds headers when needed
- **JSON Serialization**: Automatic data conversion
- **Error Checking**: Centralized error handling

### 2. Error Handling

```typescript
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}
```

**Error Strategy:**
- **Status Check**: Validates HTTP response codes
- **Message Extraction**: Gets detailed error from server
- **Consistent Format**: Standardized error structure
- **Promise Rejection**: Proper async error propagation

## TanStack Query Integration

### 1. Query Client Configuration

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: 60000, // 1 minute
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});
```

**Configuration Breakdown:**
- **Default Query Function**: Handles all basic GET requests
- **Stale Time**: Data stays fresh for 1 minute
- **Retry Logic**: Automatically retries failed requests 3 times
- **Focus Refetch**: Disabled to prevent excessive requests

### 2. Default Query Function

```typescript
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> = ({ on401 }) => {
  return async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    try {
      const res = await apiRequest("GET", url);
      return res.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        if (on401 === "returnNull") {
          return null;
        }
        throw error;
      }
      throw error;
    }
  };
};
```

**Query Function Features:**
- **Automatic URL Extraction**: Uses first query key as endpoint
- **401 Handling**: Configurable unauthorized behavior
- **JSON Parsing**: Automatic response deserialization
- **Type Safety**: Generic return type support

## Using the API Client

### 1. Basic Data Fetching

```typescript
// In a React component
function ExamplesGallery() {
  const { data: examples, isLoading, error } = useQuery<Example[]>({
    queryKey: ['/api/examples'],
  });
  
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

**Data Fetching Benefits:**
- **Automatic Caching**: No duplicate requests
- **Loading States**: Built-in loading management
- **Error States**: Automatic error handling
- **Type Safety**: Full TypeScript support

### 2. Data Mutations

```typescript
function CreateExampleForm() {
  const mutation = useMutation({
    mutationFn: async (newExample: InsertExample) => {
      const res = await apiRequest(
        "POST",
        "/api/examples",
        newExample
      );
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch examples list
      queryClient.invalidateQueries({ queryKey: ['/api/examples'] });
      toast.success('Example created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create example: ${error.message}`);
    }
  });
  
  const handleSubmit = (data: InsertExample) => {
    mutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Creating...' : 'Create Example'}
      </button>
    </form>
  );
}
```

**Mutation Features:**
- **Optimistic Updates**: UI updates before server response
- **Cache Invalidation**: Automatic data refresh
- **Loading States**: Built-in pending state management
- **Error Handling**: User-friendly error messages

## Advanced Patterns

### 1. Conditional Queries

```typescript
function ExampleDetail({ id }: { id: number | null }) {
  const { data: example } = useQuery({
    queryKey: ['/api/examples', id],
    queryFn: () => apiRequest("GET", `/api/examples/${id}`).then(r => r.json()),
    enabled: !!id, // Only run query when ID exists
  });
  
  return example ? <ExampleView example={example} /> : null;
}
```

### 2. Dependent Queries

```typescript
function ExampleWithGuides({ exampleId }: { exampleId: number }) {
  // First query
  const { data: example } = useQuery({
    queryKey: ['/api/examples', exampleId],
  });
  
  // Second query depends on first
  const { data: relatedGuides } = useQuery({
    queryKey: ['/api/guides', 'related', example?.category],
    queryFn: () => 
      apiRequest("GET", `/api/guides?category=${example?.category}`)
        .then(r => r.json()),
    enabled: !!example?.category, // Only run when category is available
  });
  
  return (
    <div>
      <ExampleView example={example} />
      <RelatedGuides guides={relatedGuides} />
    </div>
  );
}
```

### 3. Infinite Queries

```typescript
function PaginatedExamples() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['/api/examples/paginated'],
    queryFn: ({ pageParam = 1 }) =>
      apiRequest("GET", `/api/examples?page=${pageParam}&limit=10`)
        .then(r => r.json()),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });
  
  const examples = data?.pages.flatMap(page => page.items) ?? [];
  
  return (
    <div>
      {examples.map(example => (
        <ExampleCard key={example.id} example={example} />
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## Error Handling Strategies

### 1. Global Error Handling

```typescript
// In queryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error('Query error:', error);
        
        // Show user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes('401')) {
            toast.error('Please log in to continue');
          } else if (error.message.includes('403')) {
            toast.error('Permission denied');
          } else if (error.message.includes('500')) {
            toast.error('Server error. Please try again later.');
          } else {
            toast.error('Something went wrong. Please try again.');
          }
        }
      },
    },
  },
});
```

### 2. Component-Level Error Handling

```typescript
function ExamplesGallery() {
  const { data: examples, error, refetch } = useQuery({
    queryKey: ['/api/examples'],
    retry: 1, // Override global retry setting
  });
  
  if (error) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-red-600">
          Failed to load examples
        </h3>
        <p className="text-gray-600 mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // ... rest of component
}
```

### 3. Network Error Handling

```typescript
const apiRequest = async (method: string, url: string, data?: unknown) => {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    
    throw error;
  }
};
```

## Performance Optimizations

### 1. Request Deduplication

```typescript
// TanStack Query automatically deduplicates identical requests
function MultipleComponents() {
  return (
    <div>
      <ComponentA /> {/* Calls useQuery(['/api/examples']) */}
      <ComponentB /> {/* Calls useQuery(['/api/examples']) */}
      <ComponentC /> {/* Calls useQuery(['/api/examples']) */}
      {/* Only one actual HTTP request is made */}
    </div>
  );
}
```

### 2. Background Refetching

```typescript
const { data: examples } = useQuery({
  queryKey: ['/api/examples'],
  staleTime: 60000, // Consider data fresh for 1 minute
  refetchInterval: 300000, // Refetch every 5 minutes
  refetchOnWindowFocus: true, // Refetch when user returns to tab
});
```

### 3. Selective Cache Invalidation

```typescript
// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['/api/examples'] });

// Invalidate queries matching pattern
queryClient.invalidateQueries({ queryKey: ['/api/examples', 'category'] });

// Remove specific query from cache
queryClient.removeQueries({ queryKey: ['/api/examples', id] });

// Update cache directly
queryClient.setQueryData(['/api/examples', id], updatedExample);
```

## Testing the API Client

### 1. Mocking API Requests

```typescript
// In test files
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/examples', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, title: 'Test Example', description: 'Test description' }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. Testing Components with Queries

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

test('displays examples after loading', async () => {
  const queryClient = createTestQueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <ExamplesGallery />
    </QueryClientProvider>
  );
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Test Example')).toBeInTheDocument();
  });
});
```

## Key Learning Points

### API Client Benefits
- **Centralized Logic**: All HTTP requests use same patterns
- **Error Consistency**: Unified error handling across app
- **Type Safety**: Full TypeScript integration
- **Performance**: Automatic caching and deduplication

### TanStack Query Advantages
- **Declarative**: Describe what data you need, not how to get it
- **Automatic**: Handles loading, error, and success states
- **Optimized**: Background updates and intelligent caching
- **Developer Experience**: Great debugging tools and DevTools

### Best Practices
- Keep API client functions pure and testable
- Use TypeScript generics for type-safe responses
- Handle errors gracefully with user-friendly messages
- Leverage caching for better performance
- Test API integration with proper mocking

This API client architecture provides a solid foundation for building data-driven React applications with excellent user experience and developer productivity.