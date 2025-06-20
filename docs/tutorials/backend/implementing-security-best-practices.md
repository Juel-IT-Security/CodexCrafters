# Implementing Security Best Practices

Learn how to implement comprehensive security measures in your Express.js applications, including HTTP headers, rate limiting, and input validation.

## Overview

Security is a critical aspect of web application development. This tutorial covers the essential security measures implemented in our platform and how to apply them to your own projects.

## HTTP Security Headers with Helmet

### Installation and Setup

```bash
npm install helmet express-rate-limit
```

### Basic Implementation

```typescript
import helmet from "helmet";
import express from "express";

const app = express();

// Apply security headers
app.use(helmet());
```

### Advanced Configuration

For production environments, configure Content Security Policy (CSP):

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));
```

### Development vs Production

Handle different environments appropriately:

```typescript
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    // Strict CSP for production
    directives: { /* ... */ }
  } : false // Disabled in development for hot reload compatibility
}));
```

## Rate Limiting

### Basic Rate Limiting

Protect your API from abuse:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to API routes only
app.use('/api/', limiter);
```

### Advanced Rate Limiting

Different limits for different endpoints:

```typescript
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Very strict for sensitive operations
});

const normalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Apply strict limiting to auth endpoints
app.use('/api/auth/', strictLimiter);
app.use('/api/', normalLimiter);
```

## Input Validation and Sanitization

### Request Body Limits

Prevent large payload attacks:

```typescript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
```

### Zod Schema Validation

Implement robust input validation:

```typescript
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().min(0).max(120),
});

app.post('/api/users', (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: error.errors
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});
```

## Directory Traversal Protection

### Secure File Serving

Always validate file paths:

```typescript
import path from "path";

app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // Construct safe path
  const safePath = path.join(__dirname, 'uploads', filename);
  const normalizedPath = path.normalize(safePath);
  const uploadsDir = path.normalize(path.join(__dirname, 'uploads'));
  
  // Ensure path is within allowed directory
  if (!normalizedPath.startsWith(uploadsDir)) {
    return res.status(403).json({ message: "Access denied" });
  }
  
  // Serve file safely
  res.sendFile(normalizedPath);
});
```

## Error Handling Security

### Secure Error Responses

Never expose sensitive information in errors:

```typescript
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log full error details for debugging
  console.error('Server error:', err);
  
  // Send generic error message to client
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      message: "Internal server error"
    });
  } else {
    // More detailed errors in development
    res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  }
});
```

## CORS Configuration

### Basic CORS Setup

```typescript
import cors from "cors";

// Allow specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com']
    : true, // Allow all origins in development
  credentials: true,
};

app.use(cors(corsOptions));
```

## Security Headers Explained

### Key Headers Added by Helmet

1. **X-Content-Type-Options**: Prevents MIME type sniffing
2. **X-Frame-Options**: Prevents clickjacking attacks
3. **X-XSS-Protection**: Enables XSS filtering
4. **Strict-Transport-Security**: Enforces HTTPS
5. **Content-Security-Policy**: Controls resource loading

### Custom Security Headers

Add additional security headers:

```typescript
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0');
  res.setHeader('X-Powered-By', 'Custom-Server'); // Override default
  next();
});
```

## Monitoring and Logging

### Security Event Logging

Log security-relevant events:

```typescript
const securityLogger = (event: string, details: any) => {
  console.log(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Log rate limit violations
const limiter = rateLimit({
  // ... other options
  onLimitReached: (req) => {
    securityLogger('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    });
  }
});
```

## Production Deployment Security

### Environment Variables

Never hardcode sensitive values:

```typescript
// Use environment variables
const config = {
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DATABASE_URL,
  apiKeys: {
    stripe: process.env.STRIPE_SECRET_KEY
  }
};

// Validate required environment variables
if (!config.jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

### HTTPS Enforcement

Redirect HTTP to HTTPS in production:

```typescript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
});
```

## Security Testing

### Testing Rate Limits

```typescript
// Test script to verify rate limiting
const testRateLimit = async () => {
  const requests = Array.from({ length: 110 }, (_, i) => 
    fetch('/api/test').then(res => ({ status: res.status, index: i }))
  );
  
  const results = await Promise.all(requests);
  const blocked = results.filter(r => r.status === 429);
  
  console.log(`${blocked.length} requests were rate limited`);
};
```

### Security Audit Checklist

- [ ] All inputs validated with schemas
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] File paths validated
- [ ] Error messages sanitized
- [ ] CORS properly configured
- [ ] HTTPS enforced in production
- [ ] Sensitive data not logged
- [ ] Dependencies regularly updated

## Common Security Vulnerabilities

### SQL Injection Prevention

Use parameterized queries or ORMs:

```typescript
// ✅ Good: Using Drizzle ORM
const user = await db.select().from(users).where(eq(users.id, userId));

// ❌ Bad: String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

### XSS Prevention

Sanitize user inputs and use CSP:

```typescript
// ✅ Good: Validate and sanitize
const cleanInput = validator.escape(userInput);

// Set CSP header
res.setHeader('Content-Security-Policy', "default-src 'self'");
```

## Advanced Security Patterns

### API Key Management

```typescript
const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || !isValidApiKey(apiKey)) {
    return res.status(401).json({ message: 'Invalid API key' });
  }
  
  next();
};

app.use('/api/protected/', validateApiKey);
```

### Request Signature Validation

For webhook endpoints:

```typescript
const validateSignature = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.header('X-Signature');
  const payload = JSON.stringify(req.body);
  const expectedSignature = generateSignature(payload, process.env.WEBHOOK_SECRET);
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }
  
  next();
};
```

This comprehensive security implementation protects against common vulnerabilities while maintaining development productivity and user experience.