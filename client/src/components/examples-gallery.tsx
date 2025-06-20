// Examples Gallery component - displays project examples with generated AGENTS.md files
// Demonstrates data fetching, state management, and interactive UI patterns
// 📖 Learn more: /docs/tutorials/frontend/understanding-examples-gallery.md

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SyntaxHighlighter from "@/lib/syntax-highlighter";
import type { Example } from "@shared/schema";

export default function ExamplesGallery() {
  // Hook for showing toast notifications to users
  const { toast } = useToast();
  
  // State to track which example is currently selected for detailed view
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  
  // State to toggle between viewing repository structure or AGENTS.md content
  const [activeView, setActiveView] = useState<"structure" | "agents">("structure");

  // Fetch examples data from our API using TanStack Query
  // This automatically handles loading states, caching, and error handling
  const { data: examples, isLoading } = useQuery<Example[]>({
    queryKey: ["/api/examples"], // Unique cache key for this query
  });

  // Function to copy text content to user's clipboard
  // Provides user feedback through toast notifications
  const copyToClipboard = async (text: string) => {
    try {
      // Use modern Clipboard API to copy text
      await navigator.clipboard.writeText(text);
      
      // Show success notification
      toast({
        title: "Copied to clipboard",
        description: "The AGENTS.md content has been copied to your clipboard.",
      });
    } catch (error) {
      // Show error notification if copy fails
      toast({
        title: "Failed to copy",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <section id="examples" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="examples" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Examples Gallery</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our GPT analyzes different types of projects and generates tailored AGENTS.md configurations
          </p>
        </div>

        {/* Example Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {examples?.map((example) => (
            <Card key={example.id} className="bg-gray-50 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    {example.title}
                  </h3>
                  <Badge variant="secondary">
                    {example.projectType}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{example.description}</p>
                
                {/* Before/After Toggle */}
                <div className="mb-4">
                  <div className="flex border-b border-gray-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedExample(example.id);
                        setActiveView("structure");
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-none border-b-2 ${
                        selectedExample === example.id && activeView === "structure"
                          ? "border-brand-600 text-brand-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Repository Structure
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedExample(example.id);
                        setActiveView("agents");
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-none border-b-2 ${
                        selectedExample === example.id && activeView === "agents"
                          ? "border-brand-600 text-brand-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Generated AGENTS.md
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                  {selectedExample === example.id && activeView === "agents" ? (
                    <SyntaxHighlighter
                      language="markdown"
                      code={example.generatedAgentsMd}
                    />
                  ) : (
                    <pre className="text-gray-200 leading-relaxed">{example.repositoryStructure}</pre>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full AGENTS.md Preview */}
        {examples && examples.length > 0 && (
          <Card className="shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-mono">AGENTS.md</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(examples[0].generatedAgentsMd)}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 bg-gray-900 font-mono text-sm overflow-x-auto">
              <SyntaxHighlighter
                language="markdown"
                code={examples[0].generatedAgentsMd}
              />
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
