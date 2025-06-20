// Production Safety Middleware - Disables write operations until admin portal is ready
// This demonstrates production deployment patterns and environment-based feature toggling
// 📖 Learn more: /docs/tutorials/backend/production-safety-patterns.md

import { Request, Response, NextFunction } from 'express';

/**
 * Production Safety Middleware - Conditionally blocks write operations
 * 
 * This middleware demonstrates several important production patterns:
 * 1. Environment-based feature toggling
 * 2. Non-destructive deployment safety
 * 3. Read-only mode implementation
 * 4. Graceful degradation of functionality
 * 
 * How it works:
 * - Checks MUTATIONS_ENABLED environment variable
 * - Allows all read operations (GET, HEAD, OPTIONS) regardless of setting
 * - Blocks write operations (POST, PUT, PATCH, DELETE) unless explicitly enabled
 * - Returns clear error message when mutations are disabled
 * 
 * Deployment strategy:
 * 1. Deploy with MUTATIONS_ENABLED unset (mutations blocked)
 * 2. Verify read functionality works in production
 * 3. Set MUTATIONS_ENABLED=true when admin portal is ready
 * 4. All write operations resume normal functionality
 * 
 * @param req - Express request object containing HTTP method
 * @param res - Express response object for sending responses
 * @param next - Express next function to continue middleware chain
 */
export function disableMutations(req: Request, res: Response, next: NextFunction) {
  // Define HTTP methods that are considered "safe" read operations
  // These operations don't modify server state and are always allowed
  const readMethods = ['GET', 'HEAD', 'OPTIONS'];
  
  // Check if mutations are enabled via environment variable
  // Only 'true' string value enables mutations for security
  const live = process.env.MUTATIONS_ENABLED === 'true';

  // If mutations are disabled and this is a write operation, block it
  if (!live && !readMethods.includes(req.method)) {
    return res.status(403).json({
      error: 'Write operations are disabled until the admin portal is live.',
    });
  }

  // Allow the request to continue to the next middleware
  next();
}