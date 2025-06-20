# Development Tutorials

Step-by-step tutorials to expand the AGENTS.md Educational Platform with meaningful features that enhance the learning experience.

## Tutorial 1: Adding Repository URL Input

### Goal
Expand the platform to accept GitHub repository URLs for analysis, making the GPT integration more accessible.

### What We'll Build
A new input form that allows users to submit GitHub repository URLs directly on the platform, which can then be used with our custom GPT for generating AGENTS.md files.

### Steps

**1. Create the Repository Input Component**

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

**2. Add the Component to the Home Page**

```typescript
// Update client/src/pages/home.tsx
import { RepositoryInput } from "@/components/repository-input";

// Add this to the existing Home component, after the hero section
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

**Key Learning Points:**
- Form handling with React hooks (useState)
- URL validation in JavaScript
- External link integration
- Form submission and event handling
- Component props and TypeScript interfaces

---

## Tutorial 2: Adding Example Filtering and Search

### Goal
Enhance the examples gallery with filtering by project type and tags, making it easier for users to find relevant examples.

### What We'll Build
A search and filter system that allows users to:
- Filter examples by project type (Frontend, Backend, Full Stack)
- Search through example titles and descriptions
- Filter by tags

### Steps

**1. Create the Search and Filter Component**

```typescript
// client/src/components/example-filters.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Example } from "@shared/schema";

interface ExampleFiltersProps {
  examples: Example[]; // All examples from the API
  onFilteredExamples: (filtered: Example[]) => void; // Callback to send filtered results
}

export function ExampleFilters({ examples, onFilteredExamples }: ExampleFiltersProps) {
  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  // State for selected project type filter
  const [selectedType, setSelectedType] = useState<string>("all");
  // State for selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique project types from examples
  const projectTypes = [...new Set(examples.map(ex => ex.projectType))];
  
  // Get all unique tags from all examples
  const allTags = [...new Set(examples.flatMap(ex => ex.tags || []))];

  // Function that applies all filters and updates the parent component
  const applyFilters = (
    query: string, 
    type: string, 
    tags: string[]
  ) => {
    let filtered = examples;

    // Filter by search query (search in title and description)
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(example =>
        example.title.toLowerCase().includes(lowerQuery) ||
        example.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by project type
    if (type !== "all") {
      filtered = filtered.filter(example => example.projectType === type);
    }

    // Filter by selected tags (example must have ALL selected tags)
    if (tags.length > 0) {
      filtered = filtered.filter(example =>
        tags.every(tag => example.tags?.includes(tag))
      );
    }

    // Send filtered results back to parent component
    onFilteredExamples(filtered);
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    applyFilters(value, selectedType, selectedTags);
  };

  // Handle project type selection
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    applyFilters(searchQuery, value, selectedTags);
  };

  // Handle tag selection (add tag to selected tags)
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      applyFilters(searchQuery, selectedType, newTags);
    }
  };

  // Handle tag removal
  const handleTagRemove = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    applyFilters(searchQuery, selectedType, newTags);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Examples</Label>
        <Input
          id="search"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Project Type Filter */}
      <div className="space-y-2">
        <Label>Project Type</Label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {projectTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tag Filter */}
      <div className="space-y-2">
        <Label>Filter by Tags</Label>
        <Select onValueChange={handleTagSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Add tag filter" />
          </SelectTrigger>
          <SelectContent>
            {allTags.map(tag => (
              <SelectItem 
                key={tag} 
                value={tag}
                disabled={selectedTags.includes(tag)} // Disable already selected tags
              >
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Display selected tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {examples.length} example{examples.length === 1 ? '' : 's'}
      </div>
    </div>
  );
}
```

**2. Add Storage Operations**

```typescript
// server/storage.ts
export interface IStorage {
  // ... existing methods
  
  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile>;
  deleteProfile(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ... existing methods

  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  async deleteProfile(userId: string): Promise<void> {
    await db.delete(profiles).where(eq(profiles.userId, userId));
  }
}
```

**3. Create API Routes**

```typescript
// server/routes.ts (add to registerRoutes function)
// Get user profile
app.get("/api/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await storage.getProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create profile
app.post("/api/profiles", async (req, res) => {
  try {
    const result = insertProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: "Validation failed",
        details: result.error.errors
      });
    }

    const profile = await storage.createProfile(result.data);
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update profile
app.put("/api/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = insertProfileSchema.partial().safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.errors
      });
    }

    const profile = await storage.updateProfile(userId, result.data);
    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

**Key Learning Points:**
- Database schema design
- CRUD operations with Drizzle ORM
- Request validation with Zod
- Error handling patterns
- HTTP status codes

---

## Tutorial 3: Adding File Upload for ZIP Analysis

### Goal
Implement file upload functionality that allows users to upload ZIP files containing their project for AGENTS.md generation, expanding the platform's core functionality.

### What We'll Build
A drag-and-drop file upload interface that:
- Accepts ZIP files only
- Shows upload progress
- Validates file size and type
- Integrates with our GPT for analysis

### Steps

**1. Create the File Upload Component**

```typescript
// client/src/components/file-upload.tsx
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileAnalyzed?: (result: string) => void;
}

export function FileUpload({ onFileAnalyzed }: FileUploadProps) {
  // State to track the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State to show upload progress (0-100)
  const [uploadProgress, setUploadProgress] = useState(0);
  // State to track if we're currently uploading
  const [isUploading, setIsUploading] = useState(false);
  // State for drag and drop visual feedback
  const [isDragOver, setIsDragOver] = useState(false);
  
  const { toast } = useToast();

  // Function to validate if the file is acceptable
  const validateFile = (file: File): boolean => {
    // Check file type - only accept ZIP files
    const acceptedTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-zip'
    ];
    
    if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.zip')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file containing your project.",
        variant: "destructive",
      });
      return false;
    }

    // Check file size - limit to 50MB
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a ZIP file smaller than 50MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle file selection from input or drag/drop
  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  }, []);

  // Handle drag events for drag-and-drop functionality
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Prevent default behavior (opening file)
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Get the first file from the dropped files
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Simulate file upload and analysis
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Stop at 90% until we're done
          }
          return prev + 10;
        });
      }, 200);

      // In a real implementation, you would upload the file to your server
      // For now, we'll simulate the process and redirect to the GPT
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear the progress interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Since we can't actually process ZIP files in the browser,
      // we'll redirect to the GPT with instructions
      const gptUrl = "https://chatgpt.com/g/g-6854af9ed1fc81918a30a9bf2e866602-agents-md";
      const message = `I have a project ZIP file named "${selectedFile.name}" that I'd like you to analyze. Please provide instructions on how I can share this file with you to generate an AGENTS.md file.`;
      
      // Open the GPT in a new tab
      window.open(`${gptUrl}?q=${encodeURIComponent(message)}`, '_blank');

      toast({
        title: "File ready for analysis",
        description: "Opening GPT in a new tab with upload instructions.",
      });

      // Reset the component state
      setSelectedFile(null);
      setUploadProgress(0);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Project ZIP
        </CardTitle>
        <CardDescription>
          Upload a ZIP file containing your project to generate an AGENTS.md file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          // File selection area
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Drag and drop your ZIP file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={handleInputChange}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              ZIP files only, max 50MB
            </p>
          </div>
        ) : (
          // Selected file display
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Processing..." : "Analyze with GPT"}
            </Button>
          </div>
        )}

        {/* Information section */}
        <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              How it works:
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              Upload your project ZIP file and we'll open our custom GPT in a new tab 
              with instructions on how to share your file for AGENTS.md generation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**2. Create a Custom Hook for Profile Data**

```typescript
// client/src/hooks/use-profile.ts
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['/api/profiles', userId],
    queryFn: () => apiRequest<Profile>(`/profiles/${userId}`),
    enabled: !!userId,
  });
}
```

**3. Use in a Page Component**

```typescript
// client/src/pages/profile.tsx
import { useProfile } from "@/hooks/use-profile";
import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePage() {
  const userId = "user-123"; // In real app, get from auth
  const { data: profile, isLoading, error } = useProfile(userId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {profile ? "Edit Profile" : "Create Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm 
            profile={profile} 
            userId={userId}
            onSuccess={() => console.log("Profile saved!")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Key Learning Points:**
- React Hook Form integration
- Zod validation resolver
- TanStack Query mutations
- Error handling and user feedback
- Custom hooks for data fetching

---

## Tutorial 4: Database Relationships

### Goal
Create a relationship between users and their projects with proper foreign keys.

### Steps

**1. Design Related Schemas**

```typescript
// shared/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
});

export const userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["draft", "active", "completed"] }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(userProjects),
}));

export const userProjectsRelations = relations(userProjects, ({ one }) => ({
  user: one(users, {
    fields: [userProjects.userId],
    references: [users.id],
  }),
}));
```

**2. Query with Relationships**

```typescript
// server/storage.ts
async getUserWithProjects(userId: number) {
  const userWithProjects = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      projects: {
        orderBy: desc(userProjects.createdAt),
      },
    },
  });
  return userWithProjects;
}

async getProjectsForUser(userId: number) {
  const projects = await db
    .select({
      id: userProjects.id,
      title: userProjects.title,
      description: userProjects.description,
      status: userProjects.status,
      createdAt: userProjects.createdAt,
      userName: users.name,
    })
    .from(userProjects)
    .innerJoin(users, eq(userProjects.userId, users.id))
    .where(eq(userProjects.userId, userId));
  
  return projects;
}
```

**Key Learning Points:**
- Foreign key relationships
- Drizzle relations syntax
- Querying with joins
- Data modeling best practices

---

## Practice Exercises

### Exercise 1: Add Comments System
Create a commenting system for examples with:
- Comments table with foreign key to examples
- API endpoints for CRUD operations
- Frontend components for displaying and adding comments

### Exercise 2: Search and Filtering
Implement search functionality:
- Full-text search in database
- Filter by tags and categories
- Debounced search input
- Search results highlighting

### Exercise 3: User Authentication
Add authentication system:
- User registration and login
- Session management
- Protected routes
- Role-based access control

### Exercise 4: File Upload
Implement file upload feature:
- Multer middleware for file handling
- Image optimization and resizing
- Cloud storage integration
- Upload progress tracking

## Next Steps

1. Complete each tutorial step by step
2. Experiment with variations and improvements
3. Build your own features using these patterns
4. Review the Architecture Guide for advanced concepts
5. Contribute your own tutorials back to the project

Remember: Learning happens through practice. Start with simple examples and gradually build more complex features as you gain confidence.