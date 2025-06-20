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

// Create Express application instance
const app = express();

// Compression middleware for better performance
app.use(compression());

// CORS configuration for production security
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://codexcrafters.juelfoundationofselflearning.org', 'https://juelfoundationofselflearning.org']
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Enhanced security middleware with tighter CSP for production
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  } : false, // Disable CSP in development for Vite compatibility
  crossOriginEmbedderPolicy: false // Allow embedding for documentation
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

// Production safety: disable write operations until admin portal is ready
// Set MUTATIONS_ENABLED=true in environment to re-enable POST/PUT/DELETE endpoints
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

// Main application startup function using IIFE (Immediately Invoked Function Expression)
(async () => {
  // Initialize database with sample data (only runs once, skips if already seeded)
  await seedDatabase();
  
  // Register all API routes (/api/examples, /api/guides) and create HTTP server
  const server = await registerRoutes(app);

  // Global error handler - catches any unhandled errors in route handlers
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Send error response to client
    res.status(status).json({ message });
    throw err;
  });

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
