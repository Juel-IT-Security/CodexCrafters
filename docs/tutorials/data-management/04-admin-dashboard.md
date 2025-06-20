# Tutorial 4: Building an Admin Dashboard

## Goal
Create an admin dashboard that allows managing examples and guides, demonstrating full CRUD operations and data tables.

## What We'll Build
A comprehensive dashboard that includes:
- Data tables for examples and guides
- Statistics overview with cards
- Search and filtering capabilities
- Responsive design with tabs

## Prerequisites
- Understanding of data fetching with TanStack Query
- Knowledge of complex state management
- Familiarity with table/list rendering patterns

## Steps

### 1. Create the Dashboard Layout

```typescript
// client/src/components/admin-dashboard.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Search, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Example, Guide } from "@shared/schema";

export function AdminDashboard() {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all examples and guides
  const { data: examples = [], isLoading: examplesLoading } = useQuery({
    queryKey: ['/api/examples'],
    queryFn: () => apiRequest<Example[]>('/examples'),
  });

  const { data: guides = [], isLoading: guidesLoading } = useQuery({
    queryKey: ['/api/guides'],
    queryFn: () => apiRequest<Guide[]>('/guides'),
  });

  // Filter examples based on search query
  const filteredExamples = examples.filter(example =>
    example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    example.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter guides based on search query
  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics from the data
  const stats = {
    totalExamples: examples.length,
    totalGuides: guides.length,
    projectTypes: [...new Set(examples.map(ex => ex.projectType))].length,
    categories: [...new Set(guides.map(guide => guide.category))].length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage examples and guides for the AGENTS.md platform
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Examples"
          value={stats.totalExamples}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Guides"
          value={stats.totalGuides}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Project Types"
          value={stats.projectTypes}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Guide Categories"
          value={stats.categories}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search examples and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabs for Examples and Guides */}
      <Tabs defaultValue="examples" className="space-y-4">
        <TabsList>
          <TabsTrigger value="examples">
            Examples ({filteredExamples.length})
          </TabsTrigger>
          <TabsTrigger value="guides">
            Guides ({filteredGuides.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="examples">
          <ExamplesTable examples={filteredExamples} isLoading={examplesLoading} />
        </TabsContent>

        <TabsContent value="guides">
          <GuidesTable guides={filteredGuides} isLoading={guidesLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable statistics card component
function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// Examples table component
function ExamplesTable({ examples, isLoading }: { examples: Example[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="text-center py-8">Loading examples...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Examples</CardTitle>
        <CardDescription>
          Manage project examples with generated AGENTS.md files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {examples.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No examples found
            </div>
          ) : (
            examples.map((example) => (
              <ExampleRow key={example.id} example={example} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Individual example row component
function ExampleRow({ example }: { example: Example }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold">{example.title}</h3>
          <p className="text-sm text-muted-foreground">
            {example.description}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{example.projectType}</Badge>
            {example.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="outline" size="sm" title="Edit example">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-red-600" title="Delete example">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Guides table component
function GuidesTable({ guides, isLoading }: { guides: Guide[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="text-center py-8">Loading guides...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutorial Guides</CardTitle>
        <CardDescription>
          Manage tutorial guides and learning content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {guides.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No guides found
            </div>
          ) : (
            guides.map((guide) => (
              <GuideRow key={guide.id} guide={guide} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Individual guide row component
function GuideRow({ guide }: { guide: Guide }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold">{guide.title}</h3>
          <p className="text-sm text-muted-foreground">
            {guide.description}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{guide.category}</Badge>
            {guide.videoUrl && (
              <Badge variant="secondary">Has Video</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="outline" size="sm" title="Edit guide">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-red-600" title="Delete guide">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 2. Add the Dashboard Route

```typescript
// Add to client/src/App.tsx in the Router component
import { AdminDashboard } from "@/components/admin-dashboard";

// Add this route
<Route path="/admin" component={() => <AdminDashboard />} />
```

### 3. Add Navigation Link

```typescript
// Update client/src/components/navigation.tsx to include admin link
<Link 
  href="/admin" 
  className="text-sm font-medium hover:text-primary transition-colors"
>
  Admin
</Link>
```

## Key Learning Points

### Data Aggregation
- Calculating statistics from arrays of data
- Using `Set` to count unique values
- Deriving insights from raw data

### Component Composition
- Breaking down complex UI into smaller components
- Reusing components (StatCard, ExampleRow, GuideRow)
- Proper prop interfaces for component communication

### Search and Filtering
- Real-time search across multiple fields
- Case-insensitive string matching
- Filtering arrays based on user input

### Layout and Design
- Responsive grid layouts for different screen sizes
- Tab-based organization of related content
- Consistent spacing and typography

### State Management
- Managing search state across components
- Coordinating multiple data sources
- Loading state handling for better UX

## Advanced Enhancements

### Add CRUD Operations
```typescript
// Delete functionality
const deleteMutation = useMutation({
  mutationFn: (id: number) => apiRequest(`/examples/${id}`, {
    method: 'DELETE',
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/examples'] });
    toast({ title: "Example deleted successfully" });
  },
});
```

### Add Sorting
```typescript
// Sort examples by different criteria
const [sortBy, setSortBy] = useState<'title' | 'date' | 'type'>('title');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

const sortedExamples = [...filteredExamples].sort((a, b) => {
  if (sortBy === 'title') {
    return sortOrder === 'asc' 
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  }
  // Add other sorting criteria
});
```

### Add Pagination
```typescript
// Paginate large datasets
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const paginatedExamples = filteredExamples.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
```

### Add Export Functionality
```typescript
// Export data as CSV or JSON
const exportData = () => {
  const csvContent = examples.map(ex => 
    `"${ex.title}","${ex.description}","${ex.projectType}"`
  ).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'examples.csv';
  link.click();
};
```

## Performance Considerations

### Memoization
```typescript
import { useMemo } from "react";

// Memoize expensive calculations
const stats = useMemo(() => ({
  totalExamples: examples.length,
  totalGuides: guides.length,
  projectTypes: [...new Set(examples.map(ex => ex.projectType))].length,
  categories: [...new Set(guides.map(guide => guide.category))].length,
}), [examples, guides]);
```

### Virtual Scrolling
```typescript
// For large datasets, implement virtual scrolling
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }: { items: Example[] }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={100}
    itemData={items}
  >
    {({ index, data }) => <ExampleRow example={data[index]} />}
  </List>
);
```

## Next Steps

After completing this tutorial:
1. Add modal forms for creating/editing items
2. Implement bulk operations (delete multiple items)
3. Add data visualization charts
4. Consider implementing real-time updates with WebSockets

## Related Code Concepts

- [Complex State Management](../../CODE_CONCEPTS.md#frontend-concepts-react)
- [Data Processing and Arrays](../../CODE_CONCEPTS.md#common-patterns-in-our-codebase)
- [Component Composition](../../CODE_CONCEPTS.md#frontend-concepts-react)
- [API Integration Patterns](../../CODE_CONCEPTS.md#full-stack-integration)