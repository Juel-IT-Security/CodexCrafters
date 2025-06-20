import { Code, FolderSync, Rocket, MessageSquare, GitBranch, Users, FolderOpen, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <GitBranch className="w-8 h-8 mr-3" />
            Clean Git Submission Workflow
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Before Development</h4>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300">
{`# 1. Create feature branch
git checkout -b feature/[AGENT]-description

# 2. Set up AGENTS.md in root
cp AGENTS.md.template AGENTS.md

# 3. Review agent responsibilities`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">During Development</h4>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300">
{`# 1. Commit with agent tags
git commit -m "[FRONTEND] feat: add user dashboard"

# 2. Keep commits atomic and focused
git add src/components/Dashboard.tsx
git commit -m "[FRONTEND] add dashboard component"`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Before Deployment</h4>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300">
{`# 1. Run tests and linting
npm test && npm run lint

# 2. Update documentation
git add README.md CHANGELOG.md
git commit -m "[DOCS] update deployment guide"`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Deployment</h4>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300">
{`# 1. Merge to main via PR
git checkout main && git pull origin main

# 2. Deploy through Replit
# Replit auto-deploys from main branch

# 3. Tag release
git tag -a v1.0.0 -m "Release v1.0.0"`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
