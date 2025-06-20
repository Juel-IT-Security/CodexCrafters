# Tutorial 1: Adding Repository URL Input

## Goal
Expand the platform to accept GitHub repository URLs for analysis, making the GPT integration more accessible.

## What We'll Build
A new input form that allows users to submit GitHub repository URLs directly on the platform, which can then be used with our custom GPT for generating AGENTS.md files.

## Prerequisites
- Basic understanding of React components and state
- Familiarity with form handling in React
- Knowledge of TypeScript interfaces

## Steps

### 1. Create the Repository Input Component

```typescript
// client/src/components/repository-input.tsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExternalLink, Github } from "lucide-react";

export function RepositoryInput() {
  // State to track the repository URL input
  const [repoUrl, setRepoUrl] = useState("");
  // State to show when we're processing the URL
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to validate if the URL is a valid GitHub repository
  const isValidGitHubUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === "github.com" && 
             urlObj.pathname.split("/").length >= 3; // /username/repo
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    
    if (!isValidGitHubUrl(repoUrl)) {
      alert("Please enter a valid GitHub repository URL");
      return;
    }

    setIsProcessing(true);
    
    // Here we would normally send to our API, but for now we'll
    // redirect to the GPT with the repository URL
    const gptUrl = `https://chatgpt.com/g/g-6854af9ed1fc81918a30a9bf2e866602-agents-md`;
    const message = `Please analyze this GitHub repository and generate an AGENTS.md file: ${repoUrl}`;
    
    // Open the GPT in a new tab with the repository URL
    window.open(`${gptUrl}?q=${encodeURIComponent(message)}`, '_blank');
    
    setIsProcessing(false);
    setRepoUrl(""); // Clear the input
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          Analyze GitHub Repository
        </CardTitle>
        <CardDescription>
          Enter a GitHub repository URL to generate an AGENTS.md file using our custom GPT
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              type="url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || !repoUrl}
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Analyze with GPT
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 2. Add the Component to the Home Page

Update `client/src/pages/home.tsx` to include the repository input:

```typescript
import { RepositoryInput } from "@/components/repository-input";

// Add this section after the hero section
<section className="py-16 bg-gray-50 dark:bg-gray-900">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
      <p className="text-lg text-muted-foreground">
        Analyze any GitHub repository to generate an AGENTS.md file
      </p>
    </div>
    <RepositoryInput />
  </div>
</section>
```

## Key Learning Points

### Form Handling in React
- Using `useState` to manage form input state
- Handling form submission with `onSubmit`
- Preventing default form behavior with `e.preventDefault()`

### Input Validation
- Creating validation functions for specific input types
- Providing user feedback for invalid inputs
- Using TypeScript's URL constructor for URL validation

### External Integration
- Opening external URLs in new tabs
- URL encoding for safe parameter passing
- Integrating with external services (GPT)

### Component Composition
- Using shadcn/ui components for consistent styling
- Proper TypeScript interfaces for component props
- Conditional rendering based on state

## Next Steps

After completing this tutorial:
1. Try adding more validation (e.g., checking if repository exists)
2. Add loading states with better UX
3. Consider storing submitted URLs in the database
4. Move on to [Tutorial 2: Search and Filtering](../frontend/02-search-filtering.md)

## Related Code Concepts

- [Form Handling Patterns](../../CODE_CONCEPTS.md#form-handling-patterns)
- [State Management](../../CODE_CONCEPTS.md#frontend-concepts-react)
- [Component Design](../../CODE_CONCEPTS.md#frontend-concepts-react)