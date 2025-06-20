// Hero Section component - the main landing area that introduces the platform
// Demonstrates design patterns for compelling landing pages and call-to-action sections

import { Bot, Github, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-brand-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Multi-Agent Development<br />
            <span className="text-brand-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate comprehensive AGENTS.md files for OpenAI Codex to orchestrate multiple AI agents 
            on a single project. Scan repositories or upload zip files to create structured development workflows.
          </p>
          
          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 h-auto font-semibold"
            >
              <a
                href="https://chatgpt.com/g/g-6854af9ed1fc81918a30a9bf2e866602-agents-md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Bot className="w-5 h-5 mr-2" />
                Try the GPT Bot
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.querySelector("#how-it-works");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-2 border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-4 h-auto font-semibold"
            >
              Learn How It Works
            </Button>
          </div>

          {/* Input Methods Preview */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Github className="w-8 h-8 text-gray-700 mr-3" />
                  <h3 className="text-xl font-semibold">Repository Scanning</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Analyze any public GitHub repository to understand its structure and generate appropriate agent configurations.
                </p>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm text-gray-700">
                  https://github.com/your-repo
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Upload className="w-8 h-8 text-gray-700 mr-3" />
                  <h3 className="text-xl font-semibold">Zip File Upload</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Upload your project as a zip file for deep analysis of private repositories and local codebases.
                </p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  project.zip (max 25MB)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
