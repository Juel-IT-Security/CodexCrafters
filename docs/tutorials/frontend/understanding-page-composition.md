# Understanding Page Composition

## Overview

Page composition is the art of combining multiple components into cohesive, well-structured pages. This tutorial covers how to build maintainable page layouts using component composition patterns.

## What You'll Learn

- Component composition principles
- Page layout architecture
- Section organization patterns
- Responsive design at the page level
- Performance considerations for composed pages

## Page Structure Architecture

### 1. Basic Page Composition

```typescript
// client/src/pages/home.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <HowItWorks />
      <ExamplesGallery />
      <VideoGuides />
      <BestPractices />
      <CTASection />
      <Footer />
    </div>
  );
}
```

**Composition Benefits:**
- **Single Responsibility**: Each component handles one concern
- **Reusability**: Components can be used on other pages
- **Maintainability**: Easy to modify individual sections
- **Testing**: Each component can be tested independently

### 2. Section-Based Layout

```typescript
// Organized by semantic sections
<div className="min-h-screen bg-gray-50">
  {/* Global Navigation */}
  <Navigation />
  
  {/* Hero/Landing Section */}
  <HeroSection />
  
  {/* Content Sections */}
  <main>
    <HowItWorks />
    <ExamplesGallery />
    <VideoGuides />
    <BestPractices />
  </main>
  
  {/* Call to Action */}
  <CTASection />
  
  {/* Global Footer */}
  <Footer />
</div>
```

**Semantic Structure:**
- **Navigation**: Global site navigation
- **Hero**: Primary value proposition
- **Main**: Core content sections
- **CTA**: Conversion-focused section
- **Footer**: Secondary navigation and links

## Component Integration Patterns

### 1. Data Flow Between Components

```typescript
// Some components are self-contained
function ExamplesGallery() {
  const { data: examples } = useQuery({ queryKey: ['/api/examples'] });
  return <ExamplesList examples={examples} />;
}

// Others receive props from parent
function HeroSection({ headline, subtitle }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-indigo-800">
      <h1>{headline}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

// Configuration at page level
function Home() {
  return (
    <div>
      <HeroSection 
        headline="Build Better with AGENTS.md"
        subtitle="Streamline your development workflow"
      />
      <ExamplesGallery />
    </div>
  );
}
```

### 2. Shared State Management

```typescript
// Context for page-level state
const PageContext = createContext({
  activeSection: '',
  setActiveSection: () => {},
});

function Home() {
  const [activeSection, setActiveSection] = useState('');
  
  return (
    <PageContext.Provider value={{ activeSection, setActiveSection }}>
      <Navigation />
      <HeroSection />
      <ExamplesGallery />
    </PageContext.Provider>
  );
}

// Components can access page state
function Navigation() {
  const { activeSection } = useContext(PageContext);
  // Highlight active navigation item
}
```

## Layout Patterns

### 1. Full-Width Sections

```typescript
function Home() {
  return (
    <div className="min-h-screen">
      {/* Full-width navigation */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <Navigation />
        </div>
      </nav>
      
      {/* Full-width hero with background */}
      <section className="w-full bg-gradient-to-br from-blue-900 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4">
          <HeroSection />
        </div>
      </section>
      
      {/* Content sections with consistent container */}
      <main className="max-w-7xl mx-auto px-4">
        <ExamplesGallery />
        <VideoGuides />
      </main>
    </div>
  );
}
```

### 2. Container Consistency

```typescript
// Consistent container pattern
const PageContainer = ({ children, className = "" }: ContainerProps) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

// Usage in page
function Home() {
  return (
    <div>
      <Navigation />
      
      <section className="bg-blue-900">
        <PageContainer>
          <HeroSection />
        </PageContainer>
      </section>
      
      <section className="bg-white">
        <PageContainer className="py-16">
          <ExamplesGallery />
        </PageContainer>
      </section>
    </div>
  );
}
```

## Responsive Page Design

### 1. Mobile-First Sections

```typescript
function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation adapts to screen size */}
      <Navigation />
      
      {/* Hero with responsive padding and typography */}
      <section className="px-4 py-8 md:py-16 lg:py-24">
        <HeroSection />
      </section>
      
      {/* Grid sections that stack on mobile */}
      <section className="px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
        </div>
      </section>
    </div>
  );
}
```

### 2. Breakpoint Management

```typescript
// Responsive spacing system
const sectionClasses = {
  padding: "px-4 sm:px-6 lg:px-8",
  verticalSpacing: "py-8 md:py-12 lg:py-16",
  maxWidth: "max-w-7xl mx-auto",
};

function Section({ children, background = "bg-white" }: SectionProps) {
  return (
    <section className={background}>
      <div className={`${sectionClasses.maxWidth} ${sectionClasses.padding} ${sectionClasses.verticalSpacing}`}>
        {children}
      </div>
    </section>
  );
}
```

## Section-Specific Patterns

### 1. Hero Section Integration

```typescript
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build Better with AGENTS.md
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Streamline your multi-agent development workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 2. Content Section Patterns

```typescript
function ExamplesGallery() {
  const { data: examples, isLoading } = useQuery({
    queryKey: ['/api/examples']
  });

  return (
    <section id="examples" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Project Examples
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore real-world examples with generated AGENTS.md files
          </p>
        </div>
        
        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <SkeletonCards count={6} />
          ) : (
            examples?.map(example => (
              <ExampleCard key={example.id} example={example} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
```

## Performance Considerations

### 1. Component Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const ExamplesGallery = lazy(() => import('@/components/examples-gallery'));
const VideoGuides = lazy(() => import('@/components/video-guides'));

function Home() {
  return (
    <div>
      <Navigation />
      <HeroSection />
      
      <Suspense fallback={<SectionSkeleton />}>
        <ExamplesGallery />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <VideoGuides />
      </Suspense>
    </div>
  );
}
```

### 2. Intersection Observer for Animations

```typescript
const useInView = (threshold = 0.1) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
};

// Usage in sections
function AnimatedSection({ children }) {
  const { ref, inView } = useInView();
  
  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </section>
  );
}
```

## SEO and Meta Management

### 1. Page-Level SEO

```typescript
function Home() {
  useEffect(() => {
    // Update page title and meta description
    document.title = 'AGENTS.md - Multi-Agent Development Platform';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Streamline your development workflow with AI-powered AGENTS.md generation and comprehensive learning resources.'
      );
    }
  }, []);

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### 2. Structured Data

```typescript
function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AGENTS.md Educational Platform",
    "description": "Learn modern web development through comprehensive tutorials",
    "url": "https://your-domain.com"
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </div>
  );
}
```

## Error Boundaries for Page Sections

### 1. Section Error Boundaries

```typescript
class SectionErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="py-16 text-center">
          <p className="text-gray-500">This section is temporarily unavailable.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function Home() {
  return (
    <div>
      <Navigation />
      <HeroSection />
      
      <SectionErrorBoundary>
        <ExamplesGallery />
      </SectionErrorBoundary>
      
      <SectionErrorBoundary>
        <VideoGuides />
      </SectionErrorBoundary>
    </div>
  );
}
```

## Testing Page Composition

### 1. Integration Tests

```typescript
import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders all main sections', () => {
  render(<Home />);
  
  // Check that all major sections are present
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByRole('banner')).toBeInTheDocument(); // Hero section
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
});

test('sections have proper semantic structure', () => {
  render(<Home />);
  
  const sections = screen.getAllByRole('region');
  expect(sections.length).toBeGreaterThan(3); // Multiple content sections
  
  // Check for proper heading hierarchy
  const h1 = screen.getByRole('heading', { level: 1 });
  expect(h1).toBeInTheDocument();
});
```

### 2. Visual Regression Tests

```typescript
// Using tools like Playwright or Storybook
test('home page visual regression', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of full page
  await expect(page).toHaveScreenshot('home-page.png');
  
  // Test responsive breakpoints
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('home-page-tablet.png');
  
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('home-page-mobile.png');
});
```

## Key Learning Points

### Composition Benefits
- **Modularity**: Easy to add, remove, or reorder sections
- **Reusability**: Components work across different pages
- **Maintainability**: Changes isolated to individual components
- **Testing**: Each component can be tested independently

### Layout Principles
- **Consistent Containers**: Use shared container components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Semantic HTML**: Proper section and heading structure
- **Performance**: Lazy loading and intersection observers

### Best Practices
- Keep page components simple and focused on composition
- Use consistent spacing and container patterns
- Implement proper error boundaries for resilient UX
- Consider SEO and accessibility at the page level
- Test page composition as integrated user flows

This page composition pattern provides a scalable foundation for building complex, maintainable web applications with excellent user experience.