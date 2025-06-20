// Documentation viewer page - displays our educational tutorials within the app
// Demonstrates markdown rendering, navigation, and code block integration

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, BookOpen, FileText, Layers, Database, GraduationCap, Zap, Copy, Check } from "lucide-react";
import { CodeBlock, CodeLine } from "@/components/ui/code-block";
import Navigation from "@/components/navigation";

// Interface for documentation structure from API
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

export default function DocsPage() {
  const [location, navigate] = useLocation();
  const [selectedSection, setSelectedSection] = useState("beginner");
  const [selectedTutorial, setSelectedTutorial] = useState("01-understanding-code-basics");
  const [tutorialContent, setTutorialContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Parse URL to determine which tutorial to show
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const section = params.get('section') || 'beginner';
    const tutorial = params.get('tutorial') || '01-understanding-code-basics';
    
    setSelectedSection(section);
    setSelectedTutorial(tutorial);
  }, [location]);

  // Load tutorial content
  useEffect(() => {
    const loadTutorial = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you'd fetch from an API or import the markdown files
        // For now, we'll show a placeholder that demonstrates the structure
        const mockContent = generateMockTutorialContent(selectedSection, selectedTutorial);
        setTutorialContent(mockContent);
      } catch (error) {
        console.error("Failed to load tutorial:", error);
        setTutorialContent("# Error\n\nFailed to load tutorial content.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTutorial();
  }, [selectedSection, selectedTutorial]);

  const handleSectionChange = (sectionId: string) => {
    const section = tutorialSections.find(s => s.id === sectionId);
    if (section && section.tutorials.length > 0) {
      const firstTutorial = section.tutorials[0].id;
      setSelectedSection(sectionId);
      setSelectedTutorial(firstTutorial);
      navigate(`/docs?section=${sectionId}&tutorial=${firstTutorial}`);
    }
  };

  const handleTutorialChange = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
    navigate(`/docs?section=${selectedSection}&tutorial=${tutorialId}`);
  };

  const currentSection = tutorialSections.find(s => s.id === selectedSection);
  const currentTutorial = currentSection?.tutorials.find(t => t.id === selectedTutorial);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Documentation & Tutorials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Complete learning resources for building modern web applications. 
            Every concept explained from the ground up with real code examples.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Section Selector */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Tutorial Sections</h3>
                  <div className="space-y-2">
                    {tutorialSections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => handleSectionChange(section.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedSection === section.id
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{section.title}</div>
                              <div className="text-sm text-gray-500">{section.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tutorial List */}
              {currentSection && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{currentSection.title}</h3>
                    <div className="space-y-2">
                      {currentSection.tutorials.map((tutorial, index) => (
                        <button
                          key={tutorial.id}
                          onClick={() => handleTutorialChange(tutorial.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedTutorial === tutorial.id
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Badge variant="outline" className="mt-0.5">
                              {index + 1}
                            </Badge>
                            <div>
                              <div className="font-medium text-sm">{tutorial.title}</div>
                              <div className="text-xs text-gray-500">{tutorial.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
              <CardContent className="p-8">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <TutorialRenderer content={tutorialContent} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Footer */}
            {currentSection && (
              <div className="flex justify-between items-center mt-6">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <div className="text-sm text-gray-500">
                  {currentSection.tutorials.findIndex(t => t.id === selectedTutorial) + 1} of {currentSection.tutorials.length}
                </div>
                
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to render tutorial content with code blocks
function TutorialRenderer({ content }: { content: string }) {
  // Parse markdown content and render with code blocks
  const sections = content.split('```');
  
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (index % 2 === 0) {
          // Regular markdown content
          return (
            <div key={index} className="whitespace-pre-wrap">
              {section}
            </div>
          );
        } else {
          // Code block
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

// Generate mock content to demonstrate the structure
function generateMockTutorialContent(section: string, tutorial: string): string {
  return `# ${tutorial.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

Welcome to this comprehensive tutorial! This demonstrates how our documentation system works with copyable code examples.

## Code Example

Here's a React component example with our copy functionality:

\`\`\`javascript
// Example React component
function ExampleComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Click me!</button>
    </div>
  );
}
\`\`\`

## Another Example

Here's how we handle API calls:

\`\`\`typescript
// API call example
const { data, isLoading, error } = useQuery({
  queryKey: ['/api/examples'],
  queryFn: async () => {
    const response = await fetch('/api/examples');
    return response.json();
  }
});

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error occurred</div>;

return <div>{data.map(item => <div key={item.id}>{item.title}</div>)}</div>;
\`\`\`

## Key Concepts

This tutorial section demonstrates:
- Interactive code examples with copy functionality
- Proper syntax highlighting
- Step-by-step explanations
- Real-world implementation patterns

Each code block can be copied individually or in full, making it easy to follow along and implement the examples in your own projects.

## Next Steps

Continue to the next tutorial to build on these concepts and learn more advanced patterns.`;
}