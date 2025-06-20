# Development Tutorials

Step-by-step tutorials to help you learn modern web development through practical examples.

## Tutorial 1: Building Your First Component

### Goal
Create a responsive card component with TypeScript and Tailwind CSS.

### Steps

**1. Create the Component File**

```typescript
// client/src/components/project-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  onViewDetails: () => void;
}

export function ProjectCard({ title, description, tags, onViewDetails }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button onClick={onViewDetails} className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
```

**2. Use the Component**

```typescript
// client/src/pages/projects.tsx
import { ProjectCard } from "@/components/project-card";

export function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "E-commerce App",
      description: "Full-stack shopping application",
      tags: ["React", "Node.js", "PostgreSQL"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          tags={project.tags}
          onViewDetails={() => console.log(`View ${project.title}`)}
        />
      ))}
    </div>
  );
}
```

**Key Learning Points:**
- Component composition with shadcn/ui
- TypeScript interface definitions
- Responsive grid layouts
- Event handling patterns

---

## Tutorial 2: Creating API Endpoints

### Goal
Build a complete CRUD API for managing user profiles.

### Steps

**1. Define the Database Schema**

```typescript
// shared/schema.ts
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatar: text("avatar_url"),
  skills: json("skills").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
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

## Tutorial 3: Frontend Form with Validation

### Goal
Create a profile editing form with real-time validation and API integration.

### Steps

**1. Create the Form Component**

```typescript
// client/src/components/profile-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProfileSchema, type InsertProfile, type Profile } from "@shared/schema";

interface ProfileFormProps {
  profile?: Profile;
  userId: string;
  onSuccess?: () => void;
}

export function ProfileForm({ profile, userId, onSuccess }: ProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      userId,
      displayName: profile?.displayName || "",
      bio: profile?.bio || "",
      avatar: profile?.avatar || "",
      skills: profile?.skills || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertProfile) => {
      if (profile) {
        return apiRequest<Profile>(`/profiles/${userId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest<Profile>("/profiles", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles', userId] });
      toast({
        title: "Success",
        description: profile ? "Profile updated successfully" : "Profile created successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProfile) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
        </Button>
      </form>
    </Form>
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