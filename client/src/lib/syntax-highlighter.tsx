// Syntax Highlighter component - provides code highlighting for different languages
// Demonstrates useMemo optimization and string processing patterns

import { useMemo } from "react";

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export default function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  // Use useMemo to avoid re-processing code on every render
  // This optimization is important for large code blocks
  const highlightedCode = useMemo(() => {
    if (language === "markdown") {
      return code
        .replace(/^(#{1,6})\s(.+)$/gm, '<span class="text-blue-300 font-bold">$1</span> <span class="text-white font-bold">$2</span>')
        .replace(/\*\*(.+?)\*\*/g, '<span class="text-yellow-300 font-bold">$1</span>')
        .replace(/`([^`]+)`/g, '<span class="text-emerald-300 bg-gray-700 px-2 py-0.5 rounded text-sm">$1</span>')
        .replace(/^\|(.+)\|$/gm, '<span class="text-cyan-300">|$1|</span>')
        .replace(/^>\s(.+)$/gm, '<span class="text-gray-300 italic">&gt; $1</span>')
        .replace(/^[\-\*]\s(.+)$/gm, '<span class="text-gray-200">• $1</span>')
        .replace(/\[([^\]]+)\]/g, '<span class="text-orange-300 font-semibold">[$1]</span>')
        .replace(/---+/g, '<span class="text-gray-500">$&</span>');
    }
    
    // Basic syntax highlighting for other languages
    return code
      .replace(/(".*?")/g, '<span class="text-emerald-300">$1</span>')
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export)\b/g, '<span class="text-blue-300">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-400">$1</span>');
  }, [code, language]);

  return (
    <pre
      className="text-gray-100 whitespace-pre-wrap leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
