import { createLogger, format, transports } from 'winston';
import { LOG_LEVEL, LOG_FILE_PATH } from '@/config';

// Create a Winston logger instance with custom configuration
const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    // Console transport for development and debugging
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // File transport for persistent logging
    new transports.File({
      filename: LOG_FILE_PATH,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Export the logger instance for use in other modules
export { logger };