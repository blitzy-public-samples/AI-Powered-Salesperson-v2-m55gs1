import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import { RATE_LIMIT_CONFIG, REDIS_CONFIG } from '@/config';
import { logger } from '@/utils/logger';

// Redis client for storing rate limit data
let redisClient: RedisClient;

// Creates a Redis store for rate limiting
async function createRedisStore(): Promise<RedisStore> {
  // Create a new Redis client using REDIS_CONFIG
  redisClient = createClient(REDIS_CONFIG);

  // Connect to Redis
  try {
    await redisClient.connect();
    logger.info('Connected to Redis for rate limiting');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }

  // Return a new RedisStore instance with the connected client
  return new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  });
}

// Configures and returns the rate limiter middleware
async function configureRateLimiter(config: typeof RATE_LIMIT_CONFIG): Promise<RateLimitMiddleware> {
  // Call createRedisStore to get a Redis store
  const store = await createRedisStore();

  // Configure rateLimit with RATE_LIMIT_CONFIG and the Redis store
  return rateLimit({
    ...config,
    store: store,
    message: 'Too many requests, please try again later.',
    onLimitReached: (req, res, options) => {
      logger.warn(`Rate limit reached for IP: ${req.ip}`);
    },
  });
}

// Rate limiter middleware for API routes
export const apiLimiter = async (): Promise<RateLimitMiddleware> => {
  // Call configureRateLimiter with API-specific configuration
  return await configureRateLimiter(RATE_LIMIT_CONFIG.api);
};

// Stricter rate limiter for authentication routes
export const authLimiter = async (): Promise<RateLimitMiddleware> => {
  // Call configureRateLimiter with stricter auth-specific configuration
  return await configureRateLimiter(RATE_LIMIT_CONFIG.auth);
};

// Cleanup function to close Redis connection
export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Closed Redis connection for rate limiting');
  }
};

// Types
type RedisClient = ReturnType<typeof createClient>;
type RedisStore = rateLimit.Store;
type RateLimitMiddleware = rateLimit.RateLimitRequestHandler;