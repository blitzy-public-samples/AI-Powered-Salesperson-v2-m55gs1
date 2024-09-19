// Import the config function from dotenv to load environment variables
import { config } from 'dotenv';

// Import the DatabaseConfig type from the types file
import { DatabaseConfig } from '@/types';

// Load environment variables from .env file
config();

// Define the database configuration object
export const DATABASE_CONFIG: DatabaseConfig = {
  // Set the database host, defaulting to 'localhost' if not provided in env
  host: process.env.DB_HOST || 'localhost',
  
  // Set the database port, parsing it as an integer and defaulting to 5432 if not provided
  port: parseInt(process.env.DB_PORT || '5432', 10),
  
  // Set the database username, defaulting to 'postgres' if not provided
  username: process.env.DB_USERNAME || 'postgres',
  
  // Set the database password, defaulting to an empty string if not provided
  password: process.env.DB_PASSWORD || '',
  
  // Set the database name, defaulting to 'ai_salesperson' if not provided
  database: process.env.DB_NAME || 'ai_salesperson',
  
  // Set the dialect to PostgreSQL
  dialect: 'postgres',
  
  // Enable logging only in non-production environments
  logging: process.env.NODE_ENV !== 'production',
  
  // Configure the connection pool
  pool: {
    max: 5,        // Maximum number of connection in pool
    min: 0,        // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000     // The maximum time, in milliseconds, that a connection can be idle before being released
  }
};