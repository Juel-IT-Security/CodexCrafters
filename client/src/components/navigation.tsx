// Navigation component - provides main site navigation and mobile menu
// Demonstrates responsive design patterns and smooth scrolling
// 📖 Learn more: /docs/tutorials/frontend/understanding-navigation-patterns.md

import { useState } from "react";
import { Menu, X, Github, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Navigation() {
  // State to control mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Array of navigation links with section IDs and display labels
  // This makes it easy to add or remove navigation items
  const navLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#examples", label: "Examples" },
    { href: "#guides", label: "Video Guides" },
    { href: "#best-practices", label: "Best Practices" },
    { href: "/docs", label: "Documentation", isRoute: true },
  ];

  // Function to smoothly scroll to a section when navigation link is clicked
  // Also closes mobile menu after navigation
  const scrollToSection = (href: string) => {
    // Find the target element using the href as a CSS selector
    const element = document.querySelector(href);
    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip to content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Bot className="h-8 w-8 text-brand-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">AGENTS.md</span>
                </div>
                <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  Open Source
                </span>
              </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </button>
              )
            ))}
            <a
              href="https://github.com/Juel-IT-Security/CodexCrafters"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none rounded"
              aria-label="View project on GitHub (opens in new tab)"
            >
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </a>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-left px-2 py-1"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://github.com/Juel-IT-Security/CodexCrafters"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </a>
            </div>
          </div>
        )}
        </div>
      </nav>
    </>
  );
}
