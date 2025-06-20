import { Bot, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#examples", label: "Examples" },
    { href: "#guides", label: "Video Guides" },
    { href: "#best-practices", label: "Best Practices" }
  ];

  const resources = [
    { 
      href: "https://chatgpt.com/g/g-6854af9ed1fc81918a30a9bf2e866602-agents-md", 
      label: "GPT Bot",
      external: true 
    },
    { 
      href: "https://github.com/your-repo", 
      label: "GitHub Repository",
      external: true 
    },
    { 
      href: "https://replit.com", 
      label: "Replit Platform",
      external: true 
    },
    { 
      href: "https://openai.com/codex", 
      label: "OpenAI Codex",
      external: true 
    }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Bot className="w-8 h-8 text-brand-400 mr-2" />
              <span className="text-xl font-bold">AGENTS.md Generator</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Streamline your multi-agent development workflow with AI-powered AGENTS.md file generation. 
              Built for developers, by developers.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/your-repo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/your-handle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/in/your-profile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <a
                    href={resource.href}
                    target={resource.external ? "_blank" : undefined}
                    rel={resource.external ? "noopener noreferrer" : undefined}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 AGENTS.md Generator. Built with ❤️ on Replit. Open source and free to use.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="mailto:support@agents-md.dev" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
