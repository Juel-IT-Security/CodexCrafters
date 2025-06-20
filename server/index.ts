// Main server entry point for the AGENTS.md Educational Platform
// This sets up the Express server, database, and handles both development and production modes
// 📖 Learn more: /docs/tutorials/backend/understanding-server-setup.md

import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { disableMutations } from "./middleware/disableMutations";
import { errorHandler, setupUnhandledRejectionHandler } from "./middleware/errorHandler";

// Create Express application instance
const app = express();

// Performance optimization middleware - reduces response size and improves load times
// Compresses all HTTP responses using gzip, significantly reducing bandwidth usage
// 📖 Learn more: /docs/tutorials/backend/performance-optimization.md
app.use(compression());

// Cross-Origin Resource Sharing (CORS) configuration for production security
// Controls which domains can make requests to our API endpoints
// 📖 Learn more: /docs/tutorials/backend/cors-security-configuration.md
const corsOptions = {
  // Production: Only allow requests from our approved domains
  // Development: Allow all origins for easier testing
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://codexcrafters.juelfoundationofselflearning.org', 'https://juelfoundationofselflearning.org']
    : true, // Allow all origins in development
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 200 // Legacy browser support
};
app.use(cors(corsOptions));

// Enhanced security headers using Helmet middleware
// Adds multiple security-focused HTTP headers to protect against common attacks
// 📖 Learn more: /docs/tutorials/backend/security-headers-implementation.md
app.use(helmet({
  // Content Security Policy (CSP) - prevents XSS and code injection attacks
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"], // Only allow resources from same origin
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // Allow Google Fonts CSS
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow Google Fonts files
      scriptSrc: ["'self'"], // Only allow scripts from same origin (no inline scripts)
      imgSrc: ["'self'", "data:", "https:"], // Allow images from same origin, data URLs, and HTTPS
      connectSrc: ["'self'"], // Only allow fetch/XHR requests to same origin
      objectSrc: ["'none'"], // Disable plugins like Flash
      upgradeInsecureRequests: [], // Force HTTPS for all requests
    },
  } : false, // Disable CSP in development for Vite hot reload compatibility
  crossOriginEmbedderPolicy: false // Allow embedding for documentation and iframe content
}));

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Production safety middleware - prevents data modifications until admin portal is ready
// Demonstrates environment-based feature toggling and safe deployment patterns
// 📖 Learn more: /docs/tutorials/backend/production-safety-patterns.md
app.use(disableMutations);

// Middleware to parse JSON request bodies (for API requests from frontend)
app.use(express.json({ limit: '10mb' }));

// Middleware to parse URL-encoded form data (for traditional form submissions)
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Custom logging middleware to track API performance and responses
// This helps with debugging and monitoring in development
app.use((req, res, next) => {
  // Record when the request started
  const start = Date.now();
  const path = req.path;
  
  // Variable to capture the JSON response for logging
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept the res.json method to capture response data
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // When the response finishes, log the details
  res.on("finish", () => {
    const duration = Date.now() - start;
    
    // Only log API requests (not static files or frontend routes)
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Include response data in log for debugging
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Truncate very long log lines to keep output readable
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Global error handling setup - catches unhandled promises and exceptions
// Demonstrates Node.js error handling best practices and crash prevention
// 📖 Learn more: /docs/tutorials/backend/error-handling-and-monitoring.md
setupUnhandledRejectionHandler();

// Main application startup function using IIFE (Immediately Invoked Function Expression)
(async () => {
  // Initialize database with sample data (only runs once, skips if already seeded)
  await seedDatabase();
  
  // Register all API routes (/api/examples, /api/guides) and create HTTP server
  const server = await registerRoutes(app);

  // Enhanced global error handler - comprehensive error monitoring with security
  // Provides production-ready error tracking, logging, and user-friendly responses
  // 📖 Learn more: /docs/tutorials/backend/error-handling-and-monitoring.md
  app.use(errorHandler);

  // Environment-specific setup - development vs production
  // Important: Setup Vite AFTER registering API routes so the catch-all route
  // for frontend files doesn't interfere with our API endpoints
  if (app.get("env") === "development") {
    // Development: Setup Vite for hot module replacement and frontend serving
    await setupVite(app, server);
  } else {
    // Production: Serve pre-built static files from dist folder
    serveStatic(app);
  }

  // Start the server on port 5000
  // This serves both the API (/api/*) and the frontend (React app)
  // Port 5000 is the only port accessible in the Replit environment
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0", // Listen on all network interfaces
    reusePort: true, // Allow port reuse for faster restarts
  }, () => {
    log(`serving on port ${port}`);
  });
})();
