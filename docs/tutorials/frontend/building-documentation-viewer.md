# Building a Documentation Viewer

## Overview

Learn how to build a dynamic documentation viewer that reads markdown files from the file system and presents them with interactive code blocks and professional styling.

## What You'll Build

A complete documentation system featuring:
- Dynamic file system scanning
- Interactive code block copying
- Responsive navigation
- Real-time statistics
- Professional web interface

## Prerequisites

- Basic React and TypeScript knowledge
- Understanding of API design
- Familiarity with file system operations

## Step 1: Create API Endpoints

First, create the backend endpoints to serve documentation content:

```javascript
// In server/routes.ts
app.get("/api/docs", async (req, res) => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const docsPath = path.join(process.cwd(), 'docs');
    const structure = await buildDocsStructure(docsPath);
    
    res.json(structure);
  } catch (error) {
    console.error("Error reading docs structure:", error);
    res.status(500).json({ message: "Failed to load documentation structure" });
  }
});

app.get("/api/docs/content", async (req, res) => {
  try {
    const { path: filePath } = req.query;
    
    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ message: "File path is required" });
    }
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Security: ensure the path is within docs directory
    const safePath = path.join(process.cwd(), 'docs', filePath);
    const normalizedPath = path.normalize(safePath);
    const docsPath = path.normalize(path.join(process.cwd(), 'docs'));
    
    if (!normalizedPath.startsWith(docsPath)) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const content = await fs.readFile(normalizedPath, 'utf-8');
    res.json({ content, path: filePath });
    
  } catch (error) {
    console.error("Error reading documentation file:", error);
    res.status(404).json({ message: "Documentation file not found" });
  }
});
```

## Step 2: Build File System Scanner

Create a helper function to scan the documentation directory:

```javascript
async function buildDocsStructure(docsPath: string) {
  const fs = await import('fs/promises');
  const path = await import('path');

  const structure = {
    sections: [] as any[],
    totalFiles: 0,
    totalTutorials: 0
  };

  async function scanDirectory(dirPath: string, relativePath = '') {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('.')) {
          const sectionPath = path.join(dirPath, item.name);
          const sectionRelativePath = path.join(relativePath, item.name);
          
          const section = {
            id: item.name,
            title: formatSectionTitle(item.name),
            path: sectionRelativePath,
            files: [] as any[],
            subsections: [] as any[]
          };

          // Scan for files in this directory
          const sectionItems = await fs.readdir(sectionPath, { withFileTypes: true });
          
          for (const sectionItem of sectionItems) {
            if (sectionItem.isFile() && sectionItem.name.endsWith('.md')) {
              const filePath = path.join(sectionRelativePath, sectionItem.name);
              const fileContent = await fs.readFile(path.join(sectionPath, sectionItem.name), 'utf-8');
              
              // Extract title from markdown
              const titleMatch = fileContent.match(/^#\s+(.+)$/m);
              const title = titleMatch ? titleMatch[1] : formatFileName(sectionItem.name);
              
              // Extract description (first paragraph)
              const descMatch = fileContent.match(/^(?:#.*\n\n)(.+?)$/m);
              const description = descMatch ? descMatch[1].substring(0, 150) + '...' : '';

              section.files.push({
                name: sectionItem.name,
                title,
                description,
                path: filePath,
                size: fileContent.length
              });
              
              structure.totalFiles++;
              if (sectionItem.name.includes('tutorial') || section.id === 'beginner' || section.id === 'tutorials') {
                structure.totalTutorials++;
              }
            }
          }

          if (section.files.length > 0 || section.subsections.length > 0) {
            structure.sections.push(section);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
  }

  await scanDirectory(docsPath);
  return structure;
}
```

## Step 3: Create TypeScript Interfaces

Define the data structures for type safety:

```typescript
interface DocsStructure {
  sections: Array<{
    id: string;
    title: string;
    path: string;
    files: Array<{
      name: string;
      title: string;
      description: string;
      path: string;
      size: number;
    }>;
    subsections: Array<{
      id: string;
      title: string;
      path: string;
      files: Array<{
        name: string;
        title: string;
        description: string;
        path: string;
        size: number;
      }>;
    }>;
  }>;
  totalFiles: number;
  totalTutorials: number;
}
```

## Step 4: Build React Component

Create the main documentation viewer component:

```typescript
export default function DocsPage() {
  const [location, navigate] = useLocation();
  const [selectedFile, setSelectedFile] = useState<string>("");
  
  // Fetch documentation structure from API
  const { data: docsStructure, isLoading: structureLoading } = useQuery<DocsStructure>({
    queryKey: ['/api/docs'],
    staleTime: 300000, // Cache for 5 minutes
  });

  // Fetch specific documentation content
  const { data: docContent, isLoading: contentLoading } = useQuery<{content: string; path: string}>({
    queryKey: ['/api/docs/content', selectedFile],
    queryFn: () => fetch(`/api/docs/content?path=${encodeURIComponent(selectedFile)}`).then(res => res.json()),
    enabled: !!selectedFile,
    staleTime: 300000,
  });

  const handleFileChange = (filePath: string) => {
    setSelectedFile(filePath);
    navigate(`/docs?file=${filePath}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Statistics */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Learning Resources
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mb-6">
          Complete educational platform with {docsStructure?.totalTutorials || 0}+ tutorials 
          and {docsStructure?.totalFiles || 0}+ comprehensive guides.
        </p>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {docsStructure?.totalTutorials || 0}+
                  </div>
                  <div className="text-sm text-gray-500">Tutorial Guides</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation and Content */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            {docsStructure?.sections.map((section) => (
              <Card key={section.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {section.files.map((file, index) => (
                      <button
                        key={file.path}
                        onClick={() => handleFileChange(file.path)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedFile === file.path
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Badge variant="outline" className="mt-0.5 text-xs">
                            {index + 1}
                          </Badge>
                          <div>
                            <div className="font-medium text-sm">{file.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {file.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <CardContent className="p-8">
              {contentLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : docContent?.content ? (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <TutorialRenderer content={docContent.content} />
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Select a Tutorial
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a tutorial from the sidebar to start learning
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## Step 5: Create Content Renderer

Build a component to render markdown with interactive code blocks:

```typescript
function TutorialRenderer({ content }: { content: string }) {
  const sections = content.split('```');
  
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (index % 2 === 0) {
          // Regular markdown content
          return (
            <div key={index} className="prose-content">
              {section.split('\n').map((line, lineIndex) => {
                if (line.startsWith('# ')) {
                  return <h1 key={lineIndex} className="text-3xl font-bold mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={lineIndex} className="text-2xl font-semibold mb-3 mt-8">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={lineIndex} className="text-xl font-semibold mb-2 mt-6">{line.substring(4)}</h3>;
                } else if (line.trim() === '') {
                  return <br key={lineIndex} />;
                } else {
                  return <p key={lineIndex} className="text-gray-700 dark:text-gray-300 mb-4">{line}</p>;
                }
              })}
            </div>
          );
        } else {
          // Code block with copy functionality
          const lines = section.split('\n');
          const language = lines[0] || 'javascript';
          const code = lines.slice(1).join('\n');
          
          return (
            <CodeBlock key={index} title={`${language} example`}>
              {code.split('\n').map((line, lineIndex) => (
                <CodeLine key={lineIndex} code={line}>
                  <span className="text-gray-100">{line}</span>
                </CodeLine>
              ))}
            </CodeBlock>
          );
        }
      })}
    </div>
  );
}
```

## Step 6: Add Navigation Integration

Update your navigation component to include the documentation link:

```typescript
const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#examples", label: "Examples" },
  { href: "#guides", label: "Video Guides" },
  { href: "#best-practices", label: "Best Practices" },
  { href: "/docs", label: "Documentation", isRoute: true },
];

// In the navigation rendering
{navLinks.map((link) => (
  link.isRoute ? (
    <Link
      key={link.href}
      href={link.href}
      className="text-gray-600 hover:text-gray-900 transition-colors"
    >
      {link.label}
    </Link>
  ) : (
    <button
      key={link.href}
      onClick={() => scrollToSection(link.href)}
      className="text-gray-600 hover:text-gray-900 transition-colors"
    >
      {link.label}
    </button>
  )
))}
```

## Step 7: Add Routing

Register the documentation page in your app router:

```typescript
import DocsPage from "@/pages/docs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/docs" component={DocsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

## Key Learning Points

### Security Considerations
- Always validate file paths to prevent directory traversal attacks
- Normalize paths before file system access
- Restrict access to only markdown files within the docs directory

### Performance Optimizations
- Use caching to reduce file system reads
- Implement lazy loading for file content
- Optimize re-renders with proper dependency arrays

### User Experience
- Provide loading states for better feedback
- Show meaningful error messages
- Implement responsive design for mobile devices

### Code Organization
- Separate API logic from component logic
- Use TypeScript interfaces for type safety
- Create reusable components for common patterns

## Extension Ideas

### Enhanced Features
- Add search functionality across all documentation
- Implement table of contents generation
- Create cross-reference linking between documents
- Add comment system for community feedback

### Technical Improvements
- Full-text search indexing
- Advanced markdown parsing (tables, images)
- Export functionality (PDF, HTML)
- Integration with version control systems

This documentation viewer creates a professional, interactive learning environment that showcases your educational content effectively while providing excellent user experience and developer-friendly maintenance.