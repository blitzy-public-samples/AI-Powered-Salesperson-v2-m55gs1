import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { apiRouter } from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { authenticate } from '@/middleware/auth';
import { apiLimiter } from '@/middleware/rateLimiter';
import { SERVER_CONFIG } from '@/config';
import { logger } from '@/utils/logger';
import { initializeDatabase } from '@/db';

// Create Express application instance
const app: Application = express();

// Set up middleware for the Express application
function setupMiddleware(app: Application): void {
  // Use helmet for security headers
  app.use(helmet());

  // Use cors for Cross-Origin Resource Sharing
  app.use(cors());

  // Use compression for response compression
  app.use(compression());

  // Use express.json for parsing JSON request bodies
  app.use(express.json());

  // Use express.urlencoded for parsing URL-encoded request bodies
  app.use(express.urlencoded({ extended: true }));

  // Use apiLimiter for rate limiting
  app.use(apiLimiter);
}

// Set up routes for the Express application
function setupRoutes(app: Application): void {
  // Use authenticate middleware for protected routes
  app.use('/api', authenticate);

  // Use apiRouter for API routes
  app.use('/api', apiRouter);

  // Use notFoundHandler for 404 errors
  app.use(notFoundHandler);

  // Use errorHandler for global error handling
  app.use(errorHandler);
}

// Start the Express server
async function startServer(app: Application): Promise<void> {
  // Get port from SERVER_CONFIG
  const port = SERVER_CONFIG.port;

  // Start listening on the specified port
  app.listen(port, () => {
    // Log server start message
    logger.info(`Server started on port ${port}`);
  });
}

// Set up middleware
setupMiddleware(app);

// Set up routes
setupRoutes(app);

// Initialize database connection
initializeDatabase()
  .then(() => {
    // Start the server after successful database initialization
    return startServer(app);
  })
  .catch((error) => {
    logger.error('Failed to start the server:', error);
    process.exit(1);
  });

// Export app instance
export { app };