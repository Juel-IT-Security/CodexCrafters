// Documentation viewer page - displays our educational tutorials within the app
// Demonstrates markdown rendering, navigation, and code block integration
// 📖 Learn more: /docs/tutorials/frontend/building-documentation-viewer.md

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, BookOpen, FileText, Layers, Database, GraduationCap, Zap, Copy, Check } from "lucide-react";
import { CodeBlock, CodeLine } from "@/components/ui/code-block";
import Navigation from "@/components/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Copy button component for code blocks
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}



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
    queryFn: () => fetch('/api/docs').then(res => res.json()),
    staleTime: 300000, // Cache for 5 minutes
  });

  // Fetch specific documentation content
  const { data: docContent, isLoading: contentLoading } = useQuery<{content: string; path: string}>({
    queryKey: ['/api/docs/content', selectedFile],
    queryFn: () => fetch(`/api/docs/content?path=${encodeURIComponent(selectedFile)}`).then(res => res.json()),
    enabled: !!selectedFile,
    staleTime: 300000,
  });

  // Parse URL to determine which file to show
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const file = params.get('file');
    
    if (file) {
      setSelectedFile(file);
    } else if (docsStructure && !selectedFile) {
      // Default to overview page for better first impression
      setSelectedFile('overview.md');
      navigate(`/docs?file=overview.md`);
    }
  }, [location, docsStructure, navigate, selectedFile]);

  const handleFileChange = (filePath: string) => {
    setSelectedFile(filePath);
    navigate(`/docs?file=${filePath}`);
    // Reset scroll position to top when switching documents
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* Header with improved organization */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <GraduationCap className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                Documentation Hub
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-6">
              Master modern web development through comprehensive tutorials, interactive code examples, 
              and production-quality patterns. Every concept explained from first principles.
            </p>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {docsStructure?.totalTutorials || 0}+
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Tutorial Guides</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {docsStructure?.totalFiles || 0}+
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Documentation Files</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                <CardContent className="p-4 text-center">
                  <Layers className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {docsStructure?.sections?.length || 0}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Learning Sections</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                <CardContent className="p-4 text-center">
                  <Copy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    Interactive
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">Code Examples</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              {/* Quick Start Overview */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                    <GraduationCap className="h-5 w-5" />
                    <span>Start Here</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <button
                    onClick={() => handleFileChange('overview.md')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedFile === 'overview.md'
                        ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-600'
                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-5 w-5 mt-0.5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-sm">Platform Overview</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Complete introduction and learning paths
                        </div>
                      </div>
                    </div>
                  </button>
                </CardContent>
              </Card>

              {/* Organized Sections */}
              {docsStructure?.sections.map((section) => {
                const sectionIcons = {
                  'tutorials': BookOpen,
                  'guides': Layers,
                  'reference': FileText,
                  'features': Zap,
                  'examples': Copy
                };
                const IconComponent = sectionIcons[section.id as keyof typeof sectionIcons] || Database;
                
                return (
                  <Card key={section.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <IconComponent className="h-5 w-5" />
                        <span>{section.title}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {section.files.length + section.subsections.reduce((acc, sub) => acc + sub.files.length, 0)}
                        </Badge>
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
                              <Badge variant="outline" className="mt-0.5 text-xs shrink-0">
                                {index + 1}
                              </Badge>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate">{file.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {file.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {section.subsections.map((subsection) => (
                          <div key={subsection.id} className="ml-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4 mt-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Layers className="h-4 w-4 text-gray-500" />
                              <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                {subsection.title}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {subsection.files.length}
                              </Badge>
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
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    {index + 1}
                                  </Badge>
                                  <div className="font-medium text-xs truncate">{file.title}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
              <CardContent className="p-8 pb-20">
                {contentLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : docContent?.content ? (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        // Ensure proper semantic HTML for lists
                        ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        // Custom IDE-style code block with syntax highlighting
                        pre: ({ node, children, ...props }) => {
                          // Extract code content and language from children
                          const extractCodeInfo = (children: any) => {
                            let code = '';
                            let language = 'text';
                            
                            const firstChild = Array.isArray(children) ? children[0] : children;
                            if (firstChild && typeof firstChild === 'object' && firstChild.props) {
                              code = firstChild.props.children || '';
                              const className = firstChild.props.className || '';
                              language = className.replace('language-', '') || 'text';
                            } else if (typeof firstChild === 'string') {
                              code = firstChild;
                            }
                            
                            return { code, language };
                          };
                          
                          const { code, language } = extractCodeInfo(children);
                          
                          return (
                            <div className="relative group mb-6">
                              {/* Header with language and copy button */}
                              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  </div>
                                  <span className="text-sm text-gray-400 font-mono ml-2">{language}</span>
                                </div>
                                <CopyButton code={code} />
                              </div>
                              {/* Code content with IDE styling */}
                              <div className="bg-gray-900 rounded-b-lg border border-gray-700 border-t-0 relative">
                                {/* Line numbers overlay */}
                                <div className="absolute left-0 top-0 bottom-0 bg-gray-800 border-r border-gray-700 z-10">
                                  {String(code || '').split('\n').map((_, index) => (
                                    <div key={index} className="text-gray-500 text-xs font-mono px-3 py-1 text-right w-12 leading-relaxed">
                                      {index + 1}
                                    </div>
                                  ))}
                                </div>
                                {/* Syntax highlighted code */}
                                <pre 
                                  className="m-0 p-4 pl-16" 
                                  style={{ background: 'transparent' }}
                                  {...props}
                                >
                                  {children}
                                </pre>
                              </div>
                            </div>
                          );
                        },
                        code: ({ node, className, children, ...props }) => {
                          const isInline = !className?.includes('language-');
                          
                          if (isInline) {
                            return <code className="dark:bg-gray-800 px-1 py-0.5 rounded text-sm bg-[#101827] text-[#ffffff]" {...props}>{children}</code>;
                          }
                          
                          // For code blocks within pre tags, just render normally with syntax highlighting
                          return (
                            <code 
                              className={`${className || ''} font-mono text-sm leading-relaxed`}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        // Ensure proper heading hierarchy
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 mt-8" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 mt-6" {...props} />,
                        // Style paragraphs
                        p: ({ node, ...props }) => <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props} />,
                      }}
                    >
                      {docContent.content}
                    </ReactMarkdown>
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

