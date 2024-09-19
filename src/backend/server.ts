import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { app } from '@/app';
import { SERVER_CONFIG } from '@/config';
import { logger } from '@/utils/logger';
import { setupSocketHandlers } from '@/services/chatService';
import { connectToDatabase } from '@/db';

// Normalize a port into a number, string, or false
function normalizePort(val: string | number): number | string | boolean {
  const port = parseInt(val as string, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Error event listener for the HTTP server
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Listening event handler for the HTTP server
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  logger.info('Server listening on ' + bind);
}

// Start the HTTP server and set up Socket.IO
async function startServer(): Promise<void> {
  // Normalize port from SERVER_CONFIG
  const port = normalizePort(SERVER_CONFIG.PORT);

  // Set port on app
  app.set('port', port);

  // Create HTTP server with app
  const server = createServer(app);

  // Create Socket.IO instance
  const io = new SocketServer(server);

  // Set up socket handlers
  setupSocketHandlers(io);

  // Set up error and listening event handlers
  server.on('error', onError);
  server.on('listening', onListening);

  // Start listening on the specified port
  server.listen(port);
}

// Main execution
(async () => {
  try {
    // Connect to database
    await connectToDatabase();

    // Call startServer function
    await startServer();
  } catch (error) {
    // Log any errors during startup
    logger.error('Error starting server:', error);
    process.exit(1);
  }
})();