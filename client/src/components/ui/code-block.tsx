import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeLineProps {
  children: React.ReactNode;
  code: string;
  className?: string;
}

export function CodeLine({ children, code, className = "" }: CodeLineProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`group relative flex items-center justify-between hover:bg-gray-700/50 rounded px-2 py-1 transition-colors ${className}`}>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}

interface CodeBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ title, children, className = "" }: CodeBlockProps) {
  return (
    <div className="w-full">
      <h4 className="text-base sm:text-lg font-semibold mb-4 text-emerald-400">{title}</h4>
      <div className={`bg-gray-800 rounded-lg p-4 space-y-1 ${className}`}>
        {children}
      </div>
    </div>
  );
}