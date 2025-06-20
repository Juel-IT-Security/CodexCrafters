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
  const [selectedFile, setSelectedFile] = useState<string>("");
  
  // Fetch documentation structure from API
  const { data: docsStructure, isLoading: structureLoading } = useQuery<DocsStructure>({
    queryKey: ['/api/docs'],
    staleTime: 300000, // Cache for 5 minutes
  });

  // Fetch specific documentation content
  const { data: docContent, isLoading: contentLoading } = useQuery<{content: string; path: string}>({
    queryKey: ['/api/docs/content', selectedFile],
    enabled: !!selectedFile,
    staleTime: 300000,
  });

  // Parse URL to determine which file to show
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const file = params.get('file');
    
    if (file) {
      setSelectedFile(file);
    } else if (docsStructure?.sections?.[0]?.files?.[0]) {
      // Default to first available file
      const firstFile = docsStructure.sections[0].files[0] || docsStructure.sections[0].subsections?.[0]?.files?.[0];
      if (firstFile) {
        setSelectedFile(firstFile.path);
        navigate(`/docs?file=${firstFile.path}`);
      }
    }
  }, [location, docsStructure, navigate]);

  const handleFileChange = (filePath: string) => {
    setSelectedFile(filePath);
    navigate(`/docs?file=${filePath}`);
  };

  const getCurrentFile = () => {
    if (!docsStructure || !selectedFile) return null;
    
    for (const section of docsStructure.sections) {
      const file = section.files.find(f => f.path === selectedFile);
      if (file) return file;
      
      for (const subsection of section.subsections) {
        const subFile = subsection.files.find(f => f.path === selectedFile);
        if (subFile) return subFile;
      }
    }
    return null;
  };

  const currentFile = getCurrentFile();

  if (structureLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Learning Resources
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mb-6">
            Complete educational platform with {docsStructure?.totalTutorials || 0}+ tutorials and {docsStructure?.totalFiles || 0}+ comprehensive guides. 
            Every concept explained from the ground up with real, copyable code examples.
          </p>

          {/* Stats Cards */}
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
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {docsStructure?.totalFiles || 0}+
                    </div>
                    <div className="text-sm text-gray-500">Documentation Files</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {docsStructure?.sections?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Learning Sections</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {docsStructure?.sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {section.files.map((file, index) => (
                        <button
                          key={file.path}
                          onClick={() => handleFileChange(file.path)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedFile === file.path
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Badge variant="outline" className="mt-0.5 text-xs">
                              {index + 1}
                            </Badge>
                            <div>
                              <div className="font-medium text-sm">{file.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                {file.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                      
                      {section.subsections.map((subsection) => (
                        <div key={subsection.id} className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                          <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {subsection.title}
                          </div>
                          {subsection.files.map((file, index) => (
                            <button
                              key={file.path}
                              onClick={() => handleFileChange(file.path)}
                              className={`w-full text-left p-2 rounded-lg transition-colors mb-1 ${
                                selectedFile === file.path
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="font-medium text-xs">{file.title}</div>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content */}
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
          // Regular markdown content - render basic markdown
          return (
            <div key={index} className="prose-content">
              {section.split('\n').map((line, lineIndex) => {
                if (line.startsWith('# ')) {
                  return <h1 key={lineIndex} className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={lineIndex} className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 mt-8">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={lineIndex} className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 mt-6">{line.substring(4)}</h3>;
                } else if (line.trim() === '') {
                  return <br key={lineIndex} />;
                } else if (line.startsWith('- ')) {
                  return <li key={lineIndex} className="ml-4 text-gray-700 dark:text-gray-300">{line.substring(2)}</li>;
                } else {
                  return <p key={lineIndex} className="text-gray-700 dark:text-gray-300 mb-4">{line}</p>;
                }
              })}
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