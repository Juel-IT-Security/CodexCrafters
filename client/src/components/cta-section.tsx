import { Bot, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const stats = [
    { value: "1,200+", label: "Repositories Analyzed" },
    { value: "3,500+", label: "AGENTS.md Generated" },
    { value: "800+", label: "Developers Helped" },
    { value: "150+", label: "GitHub Stars" }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Streamline Your Development Workflow?
        </h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of developers using AI-powered multi-agent systems to build better software faster.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-white text-brand-600 hover:bg-gray-100 px-8 py-4 h-auto font-semibold"
          >
            <a
              href="https://chatgpt.com/g/g-6854af9ed1fc81918a30a9bf2e866602-agents-md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Bot className="w-5 h-5 mr-2" />
              Start with the GPT Bot
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-brand-600 px-8 py-4 h-auto font-semibold"
          >
            <a
              href="https://github.com/Juel-IT-Security/CodexCrafters"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-white opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
