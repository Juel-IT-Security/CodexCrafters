// Enhanced Error Handling Middleware - Production-ready error monitoring and security
// This demonstrates comprehensive error handling, logging patterns, and security best practices
// 📖 Learn more: /docs/tutorials/backend/error-handling-and-monitoring.md

import { Request, Response, NextFunction } from 'express';

/**
 * Enhanced Error Handler - Production-ready error processing with security and monitoring
 * 
 * This middleware demonstrates several critical production patterns:
 * 1. Comprehensive error logging with context
 * 2. Sensitive data protection in logs
 * 3. User-friendly error responses
 * 4. Environment-aware error details
 * 5. Error tracking with unique identifiers
 * 6. Security-conscious information disclosure
 * 
 * Key features:
 * - Generates unique error IDs for tracking and support
 * - Masks sensitive request data in logs
 * - Provides different error details based on environment
 * - Logs comprehensive context for debugging
 * - Standardizes error response format
 * 
 * Production considerations:
 * - Error logs should be sent to monitoring service (Sentry, DataDog, etc.)
 * - Sensitive information is never exposed to clients
 * - Error IDs help correlate client reports with server logs
 * - Stack traces only shown in development
 * 
 * @param err - Error object thrown by application or middleware
 * @param req - Express request object with client request details
 * @param res - Express response object for sending error response
 * @param next - Express next function (unused in error handlers)
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Generate timestamp and unique error ID for tracking
  // Error ID helps support team correlate user reports with server logs
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(2, 15);
  
  // Security: Mask request body in logs to prevent logging sensitive data
  // Never log passwords, tokens, or personal information
  const safeRequestBody = req.body ? '***masked***' : undefined;
  
  // Comprehensive error logging with context for debugging
  // In production, this should be sent to a monitoring service
  console.error(`[${timestamp}] Error ${errorId}:`, {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('user-agent'),
    ip: req.ip,
    body: safeRequestBody
  });

  // Extract HTTP status code from error object or default to 500
  const status = err.status || err.statusCode || 500;
  
  // Provide user-friendly error messages that don't expose system internals
  // These messages are safe to show to end users
  let message = 'Internal server error';
  if (status === 400) message = 'Bad request';
  else if (status === 401) message = 'Unauthorized';
  else if (status === 403) message = 'Forbidden';
  else if (status === 404) message = 'Not found';
  else if (status === 429) message = 'Too many requests';
  
  // Environment-aware error response
  // Development: Include full error details for debugging
  // Production: Only safe messages and error ID for support
  const response = process.env.NODE_ENV === 'development' ? {
    message: err.message || message,
    errorId,
    stack: err.stack  // Only include stack trace in development
  } : {
    message,
    errorId  // Error ID allows users to reference specific errors
  };

  res.status(status).json(response);
}

/**
 * Global Error Handler Setup - Catches unhandled promises and exceptions
 * 
 * This function demonstrates proper Node.js error handling patterns:
 * 1. Unhandled Promise Rejection handling
 * 2. Uncaught Exception handling
 * 3. Graceful shutdown patterns
 * 4. Production monitoring integration points
 * 
 * Why this matters:
 * - Prevents crashes from unhandled async errors
 * - Provides visibility into application stability
 * - Enables proactive monitoring and alerting
 * - Maintains service availability
 * 
 * Production considerations:
 * - Send these errors to monitoring services immediately
 * - Consider graceful shutdown for uncaught exceptions
 * - Alert on-call engineers for critical errors
 * - Track error frequency and patterns
 */
export function setupUnhandledRejectionHandler() {
  // Handle promises that reject without .catch() handlers
  // This prevents "UnhandledPromiseRejectionWarning" in Node.js
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    console.error('Promise:', promise);
    // Production: Send to monitoring service (Sentry, DataDog, etc.)
    // Consider: Alert on-call team for critical unhandled rejections
  });
  
  // Handle synchronous errors that aren't caught
  // These are serious issues that require immediate attention
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Production: Log to monitoring service before shutdown
    // Gracefully shutdown to prevent undefined application state
    process.exit(1);
  });
}