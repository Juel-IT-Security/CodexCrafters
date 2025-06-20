# Understanding Interactive Code Blocks

## Overview

Interactive code blocks are a crucial feature of our educational platform, allowing users to easily copy code examples. This tutorial covers the implementation of clipboard functionality, React children manipulation, and user feedback patterns.

## What You'll Learn

- Clipboard API usage and browser compatibility
- React children manipulation with cloneElement
- State management for UI feedback
- Accessible button design patterns
- Error handling for browser APIs

## Code Block Architecture

### 1. Individual Code Line Component

```typescript
// client/src/components/ui/code-block.tsx
export function CodeLine({ children, code, className = "" }: CodeLineProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`group flex items-center justify-between py-1 px-2 rounded hover:bg-gray-700/50 ${className}`}>
      <div className="flex-1 font-mono text-sm">{children}</div>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-6 w-6 p-0"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-400" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
```

**Key Features:**
- **Hover Reveal**: Copy button appears on hover
- **Visual Feedback**: Check icon confirms successful copy
- **Auto-Reset**: Feedback clears after 2 seconds
- **Error Handling**: Graceful fallback for clipboard failures

### 2. Multi-Line Code Block Component

```typescript
export function CodeBlock({ title, children, className = "" }: CodeBlockProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const allCode = Children.toArray(children)
      .map(child => {
        if (isValidElement(child) && child.props.code) {
          return child.props.code;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(allCode);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all code:', err);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium text-gray-300">{title}</span>
        <Button size="sm" variant="ghost" onClick={handleCopyAll}>
          {copiedAll ? 'Copied!' : 'Copy All'}
        </Button>
      </div>
      <div className={`bg-gray-800 rounded-b-lg p-4 space-y-1 ${className}`}>
        {children}
      </div>
    </div>
  );
}
```

**Advanced Features:**
- **Children Extraction**: Automatically extracts code from child components
- **Bulk Copy**: Copies all code lines as single text block
- **Header Design**: Professional code editor appearance
- **Consistent Styling**: Matches individual line styling

## Clipboard API Implementation

### 1. Modern Clipboard API

```typescript
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard API failed:', err);
    return false;
  }
};
```

### 2. Fallback Implementation

```typescript
const copyToClipboardFallback = (text: string): boolean => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
};

// Combined function with fallback
const copyText = async (text: string): Promise<boolean> => {
  if (navigator.clipboard) {
    return await copyToClipboard(text);
  } else {
    return copyToClipboardFallback(text);
  }
};
```

## React Children Manipulation

### 1. Children Traversal

```typescript
const extractCodeFromChildren = (children: React.ReactNode): string[] => {
  return Children.toArray(children)
    .map(child => {
      if (isValidElement(child)) {
        // Check if it's a CodeLine component with code prop
        if (child.props.code) {
          return child.props.code;
        }
        
        // Recursively check nested children
        if (child.props.children) {
          return extractCodeFromChildren(child.props.children);
        }
      }
      
      return null;
    })
    .filter(Boolean)
    .flat() as string[];
};
```

### 2. Children Enhancement

```typescript
const enhanceCodeChildren = (children: React.ReactNode) => {
  return Children.map(children, (child, index) => {
    if (isValidElement(child) && child.type === CodeLine) {
      // Add line numbers
      return cloneElement(child, {
        ...child.props,
        lineNumber: index + 1,
        key: `code-line-${index}`
      });
    }
    return child;
  });
};

// Usage in CodeBlock
function CodeBlock({ children, showLineNumbers = false }) {
  const enhancedChildren = showLineNumbers 
    ? enhanceCodeChildren(children) 
    : children;
    
  return (
    <div className="code-block">
      {enhancedChildren}
    </div>
  );
}
```

## User Feedback Patterns

### 1. Visual State Transitions

```typescript
function CopyButton({ onCopy, copied }: CopyButtonProps) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onCopy}
      className={`transition-all duration-200 ${
        copied 
          ? 'bg-green-500/20 text-green-400' 
          : 'hover:bg-gray-600 text-gray-400'
      }`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3 w-3" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3 w-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
```

### 2. Toast Notifications

```typescript
import { useToast } from "@/hooks/use-toast";

function CodeLine({ code, children }: CodeLineProps) {
  const { toast } = useToast();
  
  const handleCopy = async () => {
    const success = await copyText(code);
    
    if (success) {
      toast({
        title: "Code copied!",
        description: "The code has been copied to your clipboard.",
        duration: 2000,
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Unable to copy code. Please try selecting and copying manually.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="code-line">
      {children}
      <button onClick={handleCopy}>Copy</button>
    </div>
  );
}
```

## Accessibility Considerations

### 1. Keyboard Navigation

```typescript
function CodeLine({ code, children }: CodeLineProps) {
  const [copied, setCopied] = useState(false);
  
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCopy();
    }
  };

  return (
    <div className="group flex items-center">
      <div className="flex-1">{children}</div>
      <button
        onKeyDown={handleKeyDown}
        onClick={handleCopy}
        aria-label={`Copy code: ${code.substring(0, 50)}...`}
        className="copy-button"
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span className="sr-only">
          {copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
        </span>
      </button>
    </div>
  );
}
```

### 2. Screen Reader Support

```typescript
function CodeBlock({ title, children }: CodeBlockProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);

  const handleCopyAll = async () => {
    // ... copy logic
    
    if (success && announcementRef.current) {
      announcementRef.current.textContent = 'All code copied to clipboard';
    }
  };

  return (
    <div>
      <div 
        ref={announcementRef}
        className="sr-only"
        role="status"
        aria-live="polite"
      />
      
      <div className="code-block">
        <header>
          <h3>{title}</h3>
          <button
            onClick={handleCopyAll}
            aria-describedby="copy-all-description"
          >
            Copy All
          </button>
          <div id="copy-all-description" className="sr-only">
            Copy all code lines in this block to clipboard
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
```

## Error Handling and Edge Cases

### 1. Permission Handling

```typescript
const requestClipboardPermission = async (): Promise<boolean> => {
  try {
    const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
    return permission.state === 'granted' || permission.state === 'prompt';
  } catch (err) {
    // Permissions API not supported, assume clipboard is available
    return true;
  }
};

const copyWithPermissionCheck = async (text: string): Promise<boolean> => {
  const hasPermission = await requestClipboardPermission();
  
  if (!hasPermission) {
    console.warn('Clipboard permission denied');
    return false;
  }
  
  return await copyText(text);
};
```

### 2. Content Validation

```typescript
const sanitizeCodeForCopy = (code: string): string => {
  return code
    .replace(/\u00a0/g, ' ') // Replace non-breaking spaces
    .replace(/\u2000-\u200a/g, ' ') // Replace various Unicode spaces
    .replace(/\u2028/g, '\n') // Replace line separator
    .replace(/\u2029/g, '\n\n'); // Replace paragraph separator
};

const copyCode = async (rawCode: string): Promise<boolean> => {
  const cleanCode = sanitizeCodeForCopy(rawCode);
  return await copyText(cleanCode);
};
```

### 3. Browser Compatibility

```typescript
const isClipboardSupported = (): boolean => {
  return !!(
    navigator.clipboard ||
    (document.queryCommandSupported && document.queryCommandSupported('copy'))
  );
};

function CodeLine({ code, children }: CodeLineProps) {
  const clipboardSupported = isClipboardSupported();
  
  if (!clipboardSupported) {
    return (
      <div className="code-line">
        {children}
        <span className="text-gray-500 text-xs ml-2">
          (Copy not supported in this browser)
        </span>
      </div>
    );
  }

  // Normal copy functionality
  return (
    <div className="code-line">
      {children}
      <CopyButton code={code} />
    </div>
  );
}
```

## Performance Optimizations

### 1. Debounced Copy Operations

```typescript
import { debounce } from 'lodash';

const debouncedCopy = debounce(async (code: string, callback: (success: boolean) => void) => {
  const success = await copyText(code);
  callback(success);
}, 100);

function CodeLine({ code, children }: CodeLineProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    debouncedCopy(code, (success) => {
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <div>
      {children}
      <button onClick={handleCopy}>Copy</button>
    </div>
  );
}
```

### 2. Memoization for Large Code Blocks

```typescript
const CodeBlock = memo(({ title, children, className }: CodeBlockProps) => {
  const allCode = useMemo(() => {
    return Children.toArray(children)
      .map(child => {
        if (isValidElement(child) && child.props.code) {
          return child.props.code;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }, [children]);

  const handleCopyAll = async () => {
    await copyText(allCode);
  };

  return (
    <div className="code-block">
      <header>
        <span>{title}</span>
        <button onClick={handleCopyAll}>Copy All</button>
      </header>
      {children}
    </div>
  );
});
```

## Testing Interactive Code Blocks

### 1. Unit Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeLine, CodeBlock } from './code-block';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

test('copies code when copy button is clicked', async () => {
  const testCode = 'console.log("Hello, World!");';
  
  render(
    <CodeLine code={testCode}>
      <span>{testCode}</span>
    </CodeLine>
  );

  const copyButton = screen.getByRole('button', { name: /copy code/i });
  fireEvent.click(copyButton);

  await waitFor(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testCode);
  });

  // Check for success feedback
  expect(screen.getByRole('button')).toHaveTextContent('Copied');
});

test('shows error state when clipboard fails', async () => {
  navigator.clipboard.writeText = jest.fn(() => Promise.reject(new Error('Clipboard error')));
  
  render(
    <CodeLine code="test code">
      <span>test code</span>
    </CodeLine>
  );

  const copyButton = screen.getByRole('button');
  fireEvent.click(copyButton);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Copy failed');
  });
});
```

### 2. Integration Tests

```typescript
test('code block copies all lines correctly', async () => {
  const codeLines = [
    'const x = 1;',
    'const y = 2;',
    'console.log(x + y);'
  ];

  render(
    <CodeBlock title="Example">
      {codeLines.map((line, index) => (
        <CodeLine key={index} code={line}>
          <span>{line}</span>
        </CodeLine>
      ))}
    </CodeBlock>
  );

  const copyAllButton = screen.getByRole('button', { name: /copy all/i });
  fireEvent.click(copyAllButton);

  await waitFor(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      codeLines.join('\n')
    );
  });
});
```

## Key Learning Points

### Clipboard API Benefits
- **Native Browser Support**: Works across modern browsers
- **Security**: Requires user interaction and permissions
- **Performance**: Efficient for copying large amounts of text
- **User Experience**: Seamless integration with system clipboard

### React Patterns
- **Children Manipulation**: Dynamic processing of child components
- **State Management**: Local state for UI feedback
- **Error Boundaries**: Graceful handling of API failures
- **Accessibility**: Full keyboard and screen reader support

### Best Practices
- Always provide visual feedback for copy operations
- Implement fallbacks for unsupported browsers
- Use proper ARIA labels and semantic HTML
- Test clipboard functionality across different environments
- Consider performance implications for large code blocks

This interactive code block system provides an excellent foundation for educational platforms where code examples are central to the learning experience.