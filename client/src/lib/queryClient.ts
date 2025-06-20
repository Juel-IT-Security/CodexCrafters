// API client configuration for the AGENTS.md Educational Platform
// This handles all HTTP communication between frontend and backend with proper error handling
// 📖 Learn more: /docs/tutorials/frontend/understanding-api-client.md

import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Helper function to check HTTP response status and throw errors for failed requests
// This centralizes error handling for all API calls
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Extract error message from response body or use status text as fallback
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Generic API request function for making HTTP calls to our backend
// This provides a consistent interface for all API communication
export async function apiRequest(
  method: string, // HTTP method (GET, POST, PUT, DELETE)
  url: string, // API endpoint URL
  data?: unknown | undefined, // Optional request body data
): Promise<Response> {
  // Make HTTP request with proper headers and body formatting
  const res = await fetch(url, {
    method,
    // Only include Content-Type header when sending data
    headers: data ? { "Content-Type": "application/json" } : {},
    // Convert data to JSON string if provided
    body: data ? JSON.stringify(data) : undefined,
    // Include cookies for session management (if needed in future)
    credentials: "include",
  });

  // Check response status and throw error if request failed
  await throwIfResNotOk(res);
  return res;
}

// Type definition for handling authentication errors
// Determines behavior when receiving 401 Unauthorized responses
type UnauthorizedBehavior = "returnNull" | "throw";

// Factory function that creates query functions for TanStack Query
// This enables automatic data fetching with configurable error handling
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Use the first query key as the URL (TanStack Query convention)
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    // Handle authentication errors based on configuration
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    // Check for other errors and parse response
    await throwIfResNotOk(res);
    return await res.json();
  };

// Configure TanStack Query client with sensible defaults for our application
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Use our custom query function with error handling
      queryFn: getQueryFn({ on401: "throw" }),
      // Disable automatic refetching (data stays fresh until manually invalidated)
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Data never becomes stale automatically
      retry: false, // Don't retry failed requests automatically
    },
    mutations: {
      // Don't retry failed mutations (POST, PUT, DELETE operations)
      retry: false,
    },
  },
});
