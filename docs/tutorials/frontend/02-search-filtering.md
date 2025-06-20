# Tutorial 2: Adding Example Filtering and Search

## Goal
Enhance the examples gallery with filtering by project type and tags, making it easier for users to find relevant examples.

## What We'll Build
A search and filter system that allows users to:
- Filter examples by project type (Frontend, Backend, Full Stack)
- Search through example titles and descriptions
- Filter by tags

## Prerequisites
- Understanding of array methods (filter, map, includes)
- Knowledge of React state management
- Familiarity with controlled components

## Steps

### 1. Create the Search and Filter Component

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

### 2. Update the Examples Gallery Component

```typescript
// Update client/src/components/examples-gallery.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExampleFilters } from "@/components/example-filters";
import { apiRequest } from "@/lib/queryClient";
import type { Example } from "@shared/schema";

export default function ExamplesGallery() {
  // State to hold filtered examples
  const [filteredExamples, setFilteredExamples] = useState<Example[]>([]);

  const { data: examples = [], isLoading, error } = useQuery({
    queryKey: ['/api/examples'],
    queryFn: () => apiRequest<Example[]>('/examples'),
    onSuccess: (data) => {
      // Initialize filtered examples with all examples
      setFilteredExamples(data);
    },
  });

  const handleFilteredExamples = (filtered: Example[]) => {
    setFilteredExamples(filtered);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Example Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world examples of AGENTS.md files generated for different types of projects
          </p>
        </div>
        
        {/* Add the filters component */}
        <div className="mb-8">
          <ExampleFilters 
            examples={examples} 
            onFilteredExamples={handleFilteredExamples}
          />
        </div>

        {/* Display filtered examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExamples.map((example) => (
            <ExampleCard key={example.id} example={example} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Key Learning Points

### Array Manipulation
- Using `filter()` to create new arrays based on conditions
- Using `map()` to transform arrays
- Using `flatMap()` to flatten nested arrays
- Using `Set` to remove duplicates

### Complex State Management
- Managing multiple pieces of related state
- Coordinating state updates between multiple filters
- Lifting state up to parent components

### Callback Patterns
- Using callback functions to communicate between components
- Updating parent state from child components
- Event handling with custom functions

### Data Processing
- Text search with case-insensitive matching
- Multi-criteria filtering
- Dynamic filter options based on data

## Advanced Enhancements

After completing the basic tutorial, try these enhancements:

### Debounced Search
```typescript
import { useDebounce } from "@/hooks/use-debounce";

// Add debounced search to improve performance
const debouncedQuery = useDebounce(searchQuery, 300);
```

### URL State Persistence
```typescript
// Save filter state to URL for bookmarkable searches
const [searchParams, setSearchParams] = useSearchParams();
```

### Filter Presets
```typescript
// Add preset filter combinations
const filterPresets = [
  { name: "Frontend Projects", type: "Frontend", tags: ["React"] },
  { name: "Backend APIs", type: "Backend", tags: ["API"] },
];
```

## Next Steps

After completing this tutorial:
1. Add filter clearing functionality
2. Implement sort options (by date, name, etc.)
3. Add visual indicators for active filters
4. Move on to [Tutorial 3: ZIP File Upload](../file-handling/03-zip-upload.md)

## Related Code Concepts

- [Array Methods and Data Processing](../../CODE_CONCEPTS.md#common-patterns-in-our-codebase)
- [State Management Patterns](../../CODE_CONCEPTS.md#frontend-concepts-react)
- [Component Communication](../../CODE_CONCEPTS.md#frontend-concepts-react)