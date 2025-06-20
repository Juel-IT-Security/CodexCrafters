import { Github, Upload, Bot, CheckCircle, Terminal, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Two simple methods to generate your AGENTS.md file and streamline your multi-agent development workflow
          </p>
        </div>

        {/* Method 1: Repository Scanning */}
        <div className="mb-16">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-brand-100 rounded-full p-3 mr-4">
                  <Github className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Method 1: Repository Scanning</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="bg-brand-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Open the GPT</h4>
                  <p className="text-gray-600">Click the link to access our custom AGENTS.md GPT bot</p>
                </div>
                
                {/* Step 2 */}
                <div className="text-center">
                  <div className="bg-brand-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Provide Repository URL</h4>
                  <p className="text-gray-600">Share your public GitHub repository URL for analysis</p>
                </div>
                
                {/* Step 3 */}
                <div className="text-center">
                  <div className="bg-brand-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Get Your AGENTS.md</h4>
                  <p className="text-gray-600">Receive a customized multi-agent configuration file</p>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Terminal className="w-5 h-5 mr-2 text-brand-600" />
                  Example Input:
                </h5>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <span className="text-gray-300">Please analyze this repository:</span><br />
                  <span className="text-blue-300">https://github.com/microsoft/vscode</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Method 2: Zip Upload */}
        <div className="mb-16">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <Upload className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Method 2: Zip File Upload</h3>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Prepare Project</h4>
                  <p className="text-gray-600 text-sm">Zip your project files (max 25MB)</p>
                </div>
                
                {/* Step 2 */}
                <div className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Open GPT</h4>
                  <p className="text-gray-600 text-sm">Access the AGENTS.md generator</p>
                </div>
                
                {/* Step 3 */}
                <div className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Upload & Analyze</h4>
                  <p className="text-gray-600 text-sm">Upload your zip file for deep analysis</p>
                </div>
                
                {/* Step 4 */}
                <div className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    4
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Download Result</h4>
                  <p className="text-gray-600 text-sm">Get your customized AGENTS.md file</p>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-600" />
                  Best Practices for Zip Upload:
                </h5>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Include all source code files and configuration
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Exclude node_modules, build outputs, and large assets
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Keep file size under 25MB for optimal processing
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
