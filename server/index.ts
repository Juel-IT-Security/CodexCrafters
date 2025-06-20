// Main server entry point for the AGENTS.md Educational Platform
// This sets up the Express server, database, and handles both development and production modes

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";

// Create Express application instance
const app = express();

// Middleware to parse JSON request bodies (for API requests from frontend)
app.use(express.json());

// Middleware to parse URL-encoded form data (for traditional form submissions)
app.use(express.urlencoded({ extended: false }));

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

(async () => {
  // Seed the database on startup
  await seedDatabase();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
