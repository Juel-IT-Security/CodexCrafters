# Understanding CSS Design System

## Overview

A comprehensive CSS design system provides consistency, maintainability, and scalability for web applications. This tutorial covers CSS custom properties, Tailwind CSS integration, typography systems, and theming patterns.

## What You'll Learn

- CSS custom properties and design tokens
- Tailwind CSS integration and customization
- Typography and spacing systems
- Dark mode implementation
- Component-level styling patterns

## Design System Architecture

### 1. CSS Custom Properties (CSS Variables)

```css
:root {
  /* Color System */
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(20, 14.3%, 4.1%);
  --muted: hsl(60, 4.8%, 95.9%);
  --muted-foreground: hsl(25, 5.3%, 44.7%);
  
  /* Semantic Colors */
  --primary: hsl(207, 90%, 54%);
  --primary-foreground: hsl(211, 100%, 99%);
  --secondary: hsl(60, 4.8%, 95.9%);
  --secondary-foreground: hsl(24, 9.8%, 10%);
  
  /* Brand Colors */
  --brand-50: hsl(214, 100%, 97%);
  --brand-100: hsl(214, 95%, 93%);
  --brand-600: hsl(207, 90%, 54%);
  
  /* Layout */
  --radius: 0.5rem;
  --container-max-width: 1200px;
}
```

### 2. Dark Mode Support

```css
.dark {
  --background: hsl(20, 14.3%, 4.1%);
  --foreground: hsl(60, 9.1%, 97.8%);
  --muted: hsl(12, 6.5%, 15.1%);
  --muted-foreground: hsl(24, 5.4%, 63.9%);
  
  --primary: hsl(207, 90%, 54%);
  --primary-foreground: hsl(211, 100%, 99%);
  --secondary: hsl(12, 6.5%, 15.1%);
  --secondary-foreground: hsl(60, 9.1%, 97.8%);
}
```

## Typography System

### 1. Font Loading and Configuration

```css
/* Font imports with display=swap for performance */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 2. Typography Classes

```css
/* Base typography styles */
.typography-h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin-bottom: 1.5rem;
}

.typography-h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  margin-bottom: 1.25rem;
}

.typography-body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  margin-bottom: 1rem;
}

.typography-code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background-color: var(--muted);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
```

## Spacing and Layout System

### 1. Spacing Scale

```css
:root {
  /* Spacing Scale (based on 0.25rem = 4px) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### 2. Layout Utilities

```css
/* Container system */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

/* Responsive containers */
@media (min-width: 640px) {
  .container { padding-left: var(--space-6); padding-right: var(--space-6); }
}

@media (min-width: 1024px) {
  .container { padding-left: var(--space-8); padding-right: var(--space-8); }
}

/* Flexbox utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* Grid utilities */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
```

## Tailwind CSS Integration

### 1. Base Layer Customization

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight;
  }
  
  code {
    @apply relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium;
  }
}
```

### 2. Component Layer

```css
@layer components {
  /* Button base styles */
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }
  
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }
  
  .btn-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
  }
  
  /* Card components */
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
  
  .card-header {
    @apply flex flex-col space-y-1.5 p-6;
  }
  
  .card-content {
    @apply p-6 pt-0;
  }
}
```

### 3. Utility Layer Extensions

```css
@layer utilities {
  /* Custom utilities */
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

## Component-Specific Styling

### 1. Code Block Styling

```css
.code-block {
  @apply relative rounded-lg bg-muted p-4 font-mono text-sm;
  @apply border border-border;
}

.code-block-header {
  @apply flex items-center justify-between mb-3 pb-2 border-b border-border;
}

.code-block-title {
  @apply text-sm font-medium text-foreground;
}

.code-block-copy {
  @apply p-1 rounded hover:bg-background transition-colors;
}

.code-line {
  @apply block px-4 py-1 hover:bg-muted/50 transition-colors;
  @apply relative before:absolute before:left-0 before:w-1 before:h-full;
  @apply before:bg-transparent hover:before:bg-primary;
}
```

### 2. Navigation Styling

```css
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium transition-colors;
  @apply hover:bg-accent hover:text-accent-foreground;
  @apply focus:bg-accent focus:text-accent-foreground focus:outline-none;
}

.nav-link[aria-current="page"] {
  @apply bg-background text-foreground shadow-sm;
}

.mobile-nav {
  @apply fixed inset-0 z-50 bg-background/80 backdrop-blur-sm;
  @apply data-[state=open]:animate-in data-[state=closed]:animate-out;
  @apply data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0;
}
```

## Responsive Design Patterns

### 1. Mobile-First Approach

```css
/* Base styles for mobile */
.responsive-grid {
  @apply grid grid-cols-1 gap-4;
}

/* Tablet styles */
@media (min-width: 768px) {
  .responsive-grid {
    @apply grid-cols-2 gap-6;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .responsive-grid {
    @apply grid-cols-3 gap-8;
  }
}

/* Large desktop styles */
@media (min-width: 1280px) {
  .responsive-grid {
    @apply grid-cols-4;
  }
}
```

### 2. Container Queries

```css
/* Container query support */
.card-container {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .card-responsive {
    @apply flex-row;
  }
  
  .card-responsive .card-content {
    @apply flex-1;
  }
}
```

## Performance Optimization

### 1. Critical CSS

```css
/* Above-the-fold critical styles */
.critical {
  /* Font loading */
  font-display: swap;
  
  /* Layout stability */
  contain: layout style paint;
  
  /* GPU acceleration for animations */
  will-change: transform;
  transform: translateZ(0);
}
```

### 2. CSS Loading Strategy

```css
/* Non-critical CSS loading */
@media print {
  /* Print-specific styles loaded lazily */
  .print-only { display: block; }
  .screen-only { display: none; }
}

/* Prefers-reduced-motion respect */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility and User Preferences

### 1. High Contrast Mode

```css
@media (prefers-contrast: high) {
  :root {
    --background: hsl(0, 0%, 100%);
    --foreground: hsl(0, 0%, 0%);
    --border: hsl(0, 0%, 0%);
    --primary: hsl(240, 100%, 30%);
  }
  
  .dark {
    --background: hsl(0, 0%, 0%);
    --foreground: hsl(0, 0%, 100%);
    --border: hsl(0, 0%, 100%);
    --primary: hsl(240, 100%, 70%);
  }
}
```

### 2. Focus Management

```css
/* Enhanced focus indicators */
.focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}

/* Skip links for keyboard navigation */
.skip-link {
  @apply absolute -top-full left-4 z-50 px-4 py-2 bg-background text-foreground;
  @apply border border-border rounded-md;
  @apply focus:top-4 transition-all;
}
```

## Dark Mode Implementation

### 1. Theme Toggle

```css
/* Theme transition */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Disable transitions during theme switch */
.theme-transitioning * {
  transition: none !important;
}
```

### 2. System Preference Detection

```css
/* Default to system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
  }
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    color-scheme: light;
  }
}
```

## Key Learning Points

### Design System Benefits
- **Consistency**: Unified visual language across the application
- **Maintainability**: Centralized style definitions and easy updates
- **Scalability**: Systematic approach that grows with the application
- **Developer Experience**: Clear patterns and reusable components

### CSS Custom Properties Advantages
- **Dynamic theming**: Runtime color scheme switching
- **JavaScript integration**: Easy value manipulation from scripts
- **Cascade respect**: Works naturally with CSS specificity
- **Performance**: No build-time processing required

### Best Practices
- Use semantic color names rather than literal colors
- Implement consistent spacing scale for layout harmony
- Prioritize accessibility in color contrast and focus states
- Respect user preferences for motion and contrast
- Use progressive enhancement for advanced features

This comprehensive design system provides the foundation for creating consistent, accessible, and maintainable user interfaces with modern CSS techniques and Tailwind CSS integration.