import { Bot, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {

  return (
    <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Streamline Your Development Workflow?
        </h2>
        <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
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
            size="lg"
            className="justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-md border-2 border-white hover:bg-white hover:text-brand-600 px-8 py-4 h-auto font-semibold flex items-center bg-[#ffffff] text-[#0d83e9]"
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
      </div>
    </section>
  );
}
