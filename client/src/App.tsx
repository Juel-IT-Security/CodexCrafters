// Main App component - the root of our AGENTS.md Educational Platform
// This sets up routing, data fetching, and global providers for the entire application
// 📖 Learn more: /docs/tutorials/frontend/understanding-app-structure.md

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import DocsPage from "@/pages/docs";

// Router component defines all the pages/routes in our application
// Uses wouter for lightweight client-side routing
function Router() {
  return (
    <Switch>
      {/* Root route "/" shows the home page with examples gallery */}
      <Route path="/" component={Home} />
      {/* Documentation route "/docs" shows the learning resources */}
      <Route path="/docs" component={DocsPage} />
      {/* Catch-all route for any unmatched URLs shows 404 page */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component that wraps everything with necessary providers
function App() {
  return (
    // QueryClientProvider enables TanStack Query throughout the app
    // This handles all server state management, caching, and data fetching
    <QueryClientProvider client={queryClient}>
      {/* TooltipProvider enables tooltip components throughout the app */}
      <TooltipProvider>
        {/* Toaster provides toast notifications for user feedback */}
        <Toaster />
        {/* Router handles navigation between different pages */}
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
