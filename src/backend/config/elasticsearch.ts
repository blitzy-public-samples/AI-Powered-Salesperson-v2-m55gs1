// Import required dependencies
import { config } from 'dotenv';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchConfig } from '@/types';

// Load environment variables
config();

// Define Elasticsearch configuration
export const ELASTICSEARCH_CONFIG: ElasticsearchConfig = {
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || '',
  },
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
};

/**
 * Creates and returns an Elasticsearch client instance
 * @returns {Client} Elasticsearch client instance
 */
export function createElasticsearchClient(): Client {
  // Create a new Client instance using the ELASTICSEARCH_CONFIG
  const client = new Client(ELASTICSEARCH_CONFIG);

  // Return the client instance
  return client;
}