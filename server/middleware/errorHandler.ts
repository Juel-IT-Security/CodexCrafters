import { Request, Response, NextFunction } from 'express';

/**
 * Enhanced error handling middleware for production monitoring
 * Logs errors, masks sensitive data, and provides user-friendly responses
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log error details for monitoring (in production, send to Sentry/logging service)
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(2, 15);
  
  // Mask request body in logs to avoid logging sensitive data
  const safeRequestBody = req.body ? '***masked***' : undefined;
  
  console.error(`[${timestamp}] Error ${errorId}:`, {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('user-agent'),
    ip: req.ip,
    body: safeRequestBody
  });

  // Determine response status
  const status = err.status || err.statusCode || 500;
  
  // Provide user-friendly error messages
  let message = 'Internal server error';
  if (status === 400) message = 'Bad request';
  else if (status === 401) message = 'Unauthorized';
  else if (status === 403) message = 'Forbidden';
  else if (status === 404) message = 'Not found';
  else if (status === 429) message = 'Too many requests';
  
  // In development, include more error details
  const response = process.env.NODE_ENV === 'development' ? {
    message: err.message || message,
    errorId,
    stack: err.stack
  } : {
    message,
    errorId
  };

  res.status(status).json(response);
}

/**
 * Handle unhandled promise rejections
 */
export function setupUnhandledRejectionHandler() {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    console.error('Promise:', promise);
    // In production, you might want to send this to a monitoring service
  });
  
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // In production, gracefully shutdown after logging
    process.exit(1);
  });
}