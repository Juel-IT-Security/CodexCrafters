import { useMemo } from "react";

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export default function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const highlightedCode = useMemo(() => {
    if (language === "markdown") {
      return code
        .replace(/^(#{1,6})\s(.+)$/gm, '<span class="text-blue-400">$1</span> <span class="text-white font-semibold">$2</span>')
        .replace(/\*\*(.+?)\*\*/g, '<span class="text-yellow-400 font-bold">$1</span>')
        .replace(/`([^`]+)`/g, '<span class="text-green-400 bg-gray-800 px-1 rounded">$1</span>')
        .replace(/^\|(.+)\|$/gm, '<span class="text-cyan-400">|$1|</span>')
        .replace(/^>\s(.+)$/gm, '<span class="text-gray-400 italic">&gt; $1</span>')
        .replace(/^-\s(.+)$/gm, '<span class="text-gray-300">- $1</span>')
        .replace(/^\*\s(.+)$/gm, '<span class="text-gray-300">* $1</span>');
    }
    
    // Basic syntax highlighting for other languages
    return code
      .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export)\b/g, '<span class="text-blue-400">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-yellow-400">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
  }, [code, language]);

  return (
    <pre
      className="text-gray-300 whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
