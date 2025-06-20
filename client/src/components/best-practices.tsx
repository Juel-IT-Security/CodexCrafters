// Best Practices component - provides development guidance and code examples
// Demonstrates content organization, code highlighting, and educational layout patterns
// 📖 Learn more: /docs/guides/best-practices.md

import { Code, FolderSync, Rocket, MessageSquare, GitBranch, Users, FolderOpen, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock, CodeLine } from "@/components/ui/code-block";

export default function BestPractices() {
  const replitPractices = [
    {
      icon: FolderOpen,
      title: "Project Structure",
      points: [
        "Use clear folder hierarchies that match your AGENTS.md structure",
        "Keep environment variables in .env files (not .replit)",
        "Utilize Replit's built-in package management"
      ]
    },
    {
      icon: FolderSync,
      title: "Version Control",
      points: [
        "Connect your Repl to GitHub from the start",
        "Create feature branches for each agent's work",
        "Use descriptive commit messages with [AGENT] tags"
      ]
    },
    {
      icon: Rocket,
      title: "Deployment",
      points: [
        "Test thoroughly in the Replit environment before deploying",
        "Use Replit's autoscaling features for production apps",
        "Monitor your app's performance and resource usage"
      ]
    }
  ];

  const codexPractices = [
    {
      icon: MessageSquare,
      title: "Prompt Engineering",
      points: [
        "Always specify the agent role in your prompts",
        "Provide context about the current codebase state",
        "Include relevant file paths and dependencies"
      ]
    },
    {
      icon: GitBranch,
      title: "Code Review",
      points: [
        "Always review AI-generated code before committing",
        "Test generated code in isolated environments first",
        "Document any modifications made to AI suggestions"
      ]
    },
    {
      icon: Users,
      title: "Multi-Agent Coordination",
      points: [
        "Use your AGENTS.md file as the single source of truth",
        "Maintain clear boundaries between agent responsibilities",
        "Document cross-agent dependencies and interfaces"
      ]
    }
  ];

  const PracticeCard = ({ icon: Icon, title, points, iconColor }: any) => (
    <Card className="bg-gray-50 border border-gray-200">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center">
          <Icon className={`w-5 h-5 ${iconColor} mr-2`} />
          {title}
        </h4>
        <ul className="text-gray-600 space-y-2">
          {points.map((point: string, index: number) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <section id="best-practices" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential guidelines for using Replit and OpenAI Codex effectively in your development workflow
          </p>
        </div>

        {/* Best Practices Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Replit Best Practices */}
          <div>
            <div className="flex items-center mb-6">
              <Code className="w-8 h-8 text-brand-600 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900">Replit Development</h3>
            </div>
            
            <div className="space-y-6">
              {replitPractices.map((practice, index) => (
                <PracticeCard
                  key={index}
                  icon={practice.icon}
                  title={practice.title}
                  points={practice.points}
                  iconColor="text-brand-600"
                />
              ))}
            </div>
          </div>

          {/* OpenAI Codex Best Practices */}
          <div>
            <div className="flex items-center mb-6">
              <MessageSquare className="w-8 h-8 text-emerald-600 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900">OpenAI Codex Integration</h3>
            </div>
            
            <div className="space-y-6">
              {codexPractices.map((practice, index) => (
                <PracticeCard
                  key={index}
                  icon={practice.icon}
                  title={practice.title}
                  points={practice.points}
                  iconColor="text-emerald-600"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Git Workflow Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center">
            <GitBranch className="w-6 h-6 sm:w-8 sm:h-8 mr-3" />
            Clean Git Submission Workflow
          </h3>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeBlock title="Before Development">
                <CodeLine code="# 1. Create feature branch" className="text-green-400 text-sm">
                  # 1. Create feature branch
                </CodeLine>
                <CodeLine code="git checkout -b feature/[AGENT]-description" className="text-gray-100 text-sm">
                  <span className="text-blue-300">git checkout -b</span> <span className="text-yellow-300">feature/[AGENT]-description</span>
                </CodeLine>
                
                <CodeLine code="# 2. Set up AGENTS.md in root" className="text-green-400 text-sm">
                  # 2. Set up AGENTS.md in root
                </CodeLine>
                <CodeLine code="cp AGENTS.md.template AGENTS.md" className="text-gray-100 text-sm">
                  <span className="text-blue-300">cp</span> AGENTS.md.template AGENTS.md
                </CodeLine>
                
                <CodeLine code="# 3. Review agent responsibilities" className="text-green-400 text-sm">
                  # 3. Review agent responsibilities
                </CodeLine>
              </CodeBlock>
              
              <CodeBlock title="During Development">
                <CodeLine code="# 1. Commit with agent tags" className="text-green-400 text-sm">
                  # 1. Commit with agent tags
                </CodeLine>
                <CodeLine code='git commit -m "[FRONTEND] feat: add user dashboard"' className="text-gray-100 text-sm">
                  <span className="text-blue-300">git commit -m</span> <span className="text-yellow-300">"[FRONTEND] feat: add user dashboard"</span>
                </CodeLine>
                
                <CodeLine code="# 2. Keep commits atomic and focused" className="text-green-400 text-sm">
                  # 2. Keep commits atomic and focused
                </CodeLine>
                <CodeLine code="git add src/components/Dashboard.tsx" className="text-gray-100 text-sm">
                  <span className="text-blue-300">git add</span> src/components/Dashboard.tsx
                </CodeLine>
                <CodeLine code='git commit -m "[FRONTEND] add dashboard component"' className="text-gray-100 text-sm">
                  <span className="text-blue-300">git commit -m</span> <span className="text-yellow-300">"[FRONTEND] add dashboard component"</span>
                </CodeLine>
              </CodeBlock>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeBlock title="Before Deployment">
                <CodeLine code="# 1. Run tests and linting" className="text-green-400 text-sm">
                  # 1. Run tests and linting
                </CodeLine>
                <CodeLine code="npm test && npm run lint" className="text-gray-100 text-sm">
                  <span className="text-blue-300">npm test</span> && <span className="text-blue-300">npm run lint</span>
                </CodeLine>
                
                <CodeLine code="# 2. Update documentation" className="text-green-400 text-sm">
                  # 2. Update documentation
                </CodeLine>
                <CodeLine code="git add README.md CHANGELOG.md" className="text-gray-100 text-sm">
                  <span className="text-blue-300">git add</span> README.md CHANGELOG.md
                </CodeLine>
                <CodeLine code='git commit -m "[DOCS] update deployment guide"' className="text-gray-100 text-sm">
                  <span className="text-blue-300">git commit -m</span> <span className="text-yellow-300">"[DOCS] update deployment guide"</span>
                </CodeLine>
              </CodeBlock>
              
              <CodeBlock title="Deployment">
                <CodeLine code="# 1. Merge to main via PR" className="text-green-400 text-sm">
                  # 1. Merge to main via PR
                </CodeLine>
                <CodeLine code="git checkout main && git pull origin main" className="text-gray-100 text-sm">
                  <span className="text-blue-300">git checkout</span> main && <span className="text-blue-300">git pull</span> origin main
                </CodeLine>
                
                <CodeLine code="# 2. Deploy through Replit" className="text-green-400 text-sm">
                  # 2. Deploy through Replit
                </CodeLine>
                <CodeLine code="# Replit auto-deploys from main branch" className="text-gray-400 text-sm">
                  # Replit auto-deploys from main branch
                </CodeLine>
                
                <CodeLine code="# 3. Tag release" className="text-green-400 text-sm">
                  # 3. Tag release
                </CodeLine>
                <CodeLine code='git tag -a v1.0.0 -m "Release v1.0.0"' className="text-gray-100 text-sm">
                  <span className="text-blue-300">git tag -a</span> v1.0.0 <span className="text-blue-300">-m</span> <span className="text-yellow-300">"Release v1.0.0"</span>
                </CodeLine>
              </CodeBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
