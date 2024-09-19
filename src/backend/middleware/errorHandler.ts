import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { AppError } from '@/types';

// Global error handling middleware
export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
  // Log the error using the logger utility
  logger.error(err);

  // Determine if the error is an instance of AppError
  const isAppError = err instanceof AppError;

  // Set status code and message based on error type
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : 'Internal Server Error';

  // Prepare the error response
  const errorResponse: any = {
    status: 'error',
    message,
  };

  // In development mode, include error stack in response
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Send JSON response with error details
  res.status(statusCode).json(errorResponse);
};

// Middleware to handle 404 Not Found errors
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  // Create a new AppError with 404 status and 'Not Found' message
  const error = new AppError('Not Found', 404);

  // Pass the error to the next middleware (which will be errorHandler)
  next(error);
};

// Wrapper for async route handlers to catch errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Execute the passed function and catch any errors
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};