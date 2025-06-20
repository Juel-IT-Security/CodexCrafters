# Accessibility Implementation Guide

Learn how to build accessible web applications that work for all users, including those using assistive technologies. This guide covers the accessibility improvements implemented in our platform.

## Core Accessibility Principles

### WCAG 2.1 Guidelines

Our implementation follows Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards:

1. **Perceivable** - Information must be presentable in ways users can perceive
2. **Operable** - Interface components must be operable by all users
3. **Understandable** - Information and UI operation must be understandable
4. **Robust** - Content must be robust enough for various assistive technologies

## Skip Navigation Implementation

### Skip-to-Content Links

Essential for keyboard and screen reader users:

```typescript
// Add at the beginning of your main layout
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
>
  Skip to main content
</a>
```

### CSS Classes for Screen Readers

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

## ARIA Labels and Descriptions

### Interactive Elements

Add descriptive labels for all interactive elements:

```typescript
// Mobile menu toggle
<Button
  variant="ghost"
  size="sm"
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
>
  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
</Button>

// Mobile menu container
<div id="mobile-menu" className="md:hidden border-t border-gray-200 py-4">
  {/* Menu content */}
</div>
```

### External Links

Provide context for external links:

```typescript
<a
  href="https://github.com/project"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="View project on GitHub (opens in new tab)"
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none rounded"
>
  <Github className="w-4 h-4" />
  GitHub
</a>
```

### Icon-Only Buttons

Always provide text alternatives for icons:

```typescript
// Social media links in footer
<a
  href="https://twitter.com/handle"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Follow us on Twitter (opens in new tab)"
  className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none rounded"
>
  <Twitter className="w-5 h-5" />
</a>
```

## Keyboard Navigation

### Focus Management

Ensure all interactive elements are keyboard accessible:

```typescript
// Add focus styles to all interactive elements
const focusClasses = "focus:ring-2 focus:ring-blue-500 focus:outline-none rounded";

<button
  className={`text-gray-600 hover:text-gray-900 transition-colors ${focusClasses}`}
  onClick={handleClick}
>
  Button Text
</button>
```

### Tab Order

Maintain logical tab order through your interface:

```typescript
// Use tabIndex sparingly, rely on DOM order
<nav>
  <button>First focusable</button>
  <button>Second focusable</button>
  <button>Third focusable</button>
</nav>
```

### Escape Key Handling

Close modals and menus with escape key:

```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isMobileMenuOpen]);
```

## Semantic HTML Structure

### Proper Heading Hierarchy

Maintain logical heading structure:

```typescript
// ✅ Good: Logical heading hierarchy
<h1>Page Title</h1>
<section>
  <h2>Main Section</h2>
  <h3>Subsection</h3>
</section>

// ❌ Bad: Skipping heading levels
<h1>Page Title</h1>
<h4>Subsection</h4>
```

### Main Content Areas

Mark primary content areas:

```typescript
<main id="main-content">
  <h1>Page Title</h1>
  {/* Main page content */}
</main>
```

### Navigation Landmarks

Use semantic navigation elements:

```typescript
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/docs">Documentation</a></li>
  </ul>
</nav>

<nav aria-label="Breadcrumb navigation">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Docs</a></li>
    <li aria-current="page">Current Page</li>
  </ol>
</nav>
```

## Accessible Forms

### Form Labels

Associate labels with form controls:

```typescript
<div className="form-group">
  <label htmlFor="email" className="block text-sm font-medium">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    name="email"
    required
    aria-describedby="email-error"
    className="mt-1 block w-full"
  />
  <div id="email-error" className="text-red-600 text-sm" role="alert">
    {emailError}
  </div>
</div>
```

### Error Handling

Provide clear error messages:

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

// Announce errors to screen readers
useEffect(() => {
  if (Object.keys(errors).length > 0) {
    const errorMessage = `Form has ${Object.keys(errors).length} errors: ${Object.values(errors).join(', ')}`;
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = errorMessage;
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
    
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
}, [errors]);
```

## Color and Contrast

### Color Contrast Standards

Ensure sufficient color contrast ratios:

```css
/* ✅ Good: High contrast (4.5:1 or higher) */
.text-primary {
  color: #1f2937; /* Dark gray on white background */
}

/* ✅ Good: Check contrast for all color combinations */
.bg-blue-600 {
  background-color: #2563eb; /* Ensure white text has sufficient contrast */
  color: white;
}
```

### Color Independence

Don't rely solely on color to convey information:

```typescript
// ✅ Good: Use both color and text/icons
<div className="flex items-center">
  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
  <span className="text-green-800">Success: Form submitted</span>
</div>

<div className="flex items-center">
  <XCircle className="w-4 h-4 text-red-600 mr-2" />
  <span className="text-red-800">Error: Please check your input</span>
</div>
```

## Responsive and Mobile Accessibility

### Touch Targets

Ensure touch targets are large enough:

```css
/* Minimum 44px × 44px touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Mobile Navigation

Accessible mobile menus:

```typescript
<div className="md:hidden">
  <Button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    aria-expanded={isMobileMenuOpen}
    aria-controls="mobile-menu"
  >
    {isMobileMenuOpen ? <X /> : <Menu />}
  </Button>
</div>

{isMobileMenuOpen && (
  <div id="mobile-menu" className="md:hidden">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="block px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {link.label}
      </Link>
    ))}
  </div>
)}
```

## Content Accessibility

### Markdown and Rich Content

Use semantic HTML in markdown rendering:

```typescript
<ReactMarkdown
  components={{
    // Proper list semantics
    ul: ({ node, ...props }) => 
      <ul className="list-disc ml-6 mb-4" {...props} />,
    ol: ({ node, ...props }) => 
      <ol className="list-decimal ml-6 mb-4" {...props} />,
    li: ({ node, ...props }) => 
      <li className="mb-1" {...props} />,
    
    // Accessible code blocks
    pre: ({ node, ...props }) => 
      <pre 
        className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"
        tabIndex={0}
        {...props} 
      />,
    
    // Proper heading hierarchy
    h1: ({ node, ...props }) => 
      <h1 className="text-3xl font-bold mb-4" {...props} />,
    h2: ({ node, ...props }) => 
      <h2 className="text-2xl font-semibold mb-3 mt-8" {...props} />,
  }}
>
  {content}
</ReactMarkdown>
```

### Alternative Text

Provide meaningful alt text for images:

```typescript
// ✅ Good: Descriptive alt text
<img 
  src="/diagram.png" 
  alt="Workflow diagram showing user authentication process with OAuth"
  className="max-w-full h-auto"
/>

// ✅ Good: Decorative images
<img 
  src="/decoration.png" 
  alt="" 
  role="presentation"
  className="decorative-image"
/>
```

## Testing Accessibility

### Automated Testing

Use accessibility testing tools:

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y
```

```typescript
// Add to your test setup
import { configure } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Test accessibility in components
test('should not have accessibility violations', async () => {
  const { container } = render(<YourComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

Essential manual testing steps:

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Use arrow keys in menus
   - Test escape key functionality
   - Verify focus is visible

2. **Screen Reader Testing**
   - Test with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac)
   - Verify proper announcements
   - Check heading navigation
   - Test landmark navigation

3. **Color and Contrast**
   - Use color contrast analyzers
   - Test in high contrast mode
   - Verify colorblind accessibility

### Accessibility Checklist

- [ ] All images have appropriate alt text
- [ ] Forms have proper labels and error handling
- [ ] Interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards
- [ ] Heading hierarchy is logical
- [ ] ARIA labels are provided where needed
- [ ] Skip navigation links are implemented
- [ ] Content is structured semantically
- [ ] Touch targets are appropriately sized

## Accessibility API Integration

### Live Regions

Announce dynamic content changes:

```typescript
const [message, setMessage] = useState('');

// Announce status updates
<div 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {message}
</div>

// For urgent announcements
<div 
  aria-live="assertive" 
  aria-atomic="true"
  className="sr-only"
>
  {urgentMessage}
</div>
```

### Progress Indication

Accessible loading states:

```typescript
<div role="status" aria-label="Loading content">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  <span className="sr-only">Loading...</span>
</div>
```

This comprehensive accessibility implementation ensures your application is usable by everyone, regardless of their abilities or the assistive technologies they use.