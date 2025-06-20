import { useState, Children, isValidElement, cloneElement } from "react";
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
    <div className={`group relative flex items-center justify-between hover:bg-gray-700/30 rounded px-2 py-1 transition-colors ${className}`}>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-6 w-6 p-0 text-gray-400 hover:text-white shrink-0"
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
  const [copiedAll, setCopiedAll] = useState(false);

  const extractAllCode = () => {
    const codes: string[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.props.code) {
        codes.push(child.props.code);
      }
    });
    return codes.join('\n');
  };

  const handleCopyAll = async () => {
    try {
      const allCode = extractAllCode();
      await navigator.clipboard.writeText(allCode);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base sm:text-lg font-semibold text-emerald-400">{title}</h4>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white h-8 px-3"
          onClick={handleCopyAll}
        >
          {copiedAll ? (
            <Check className="h-4 w-4 mr-1" />
          ) : (
            <Copy className="h-4 w-4 mr-1" />
          )}
          {copiedAll ? 'Copied!' : 'Copy All'}
        </Button>
      </div>
      <div className={`bg-gray-800 rounded-lg p-4 space-y-1 ${className}`}>
        {children}
      </div>
    </div>
  );
}