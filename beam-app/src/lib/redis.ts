import { createClient } from 'redis';

/**
 * Initiate the redis client
 */
const redis = createClient({
  url: process.env.REDIS_CACHE_ENDPOINT,
  username: process.env.REDIS_CACHE_USERNAME,
  password: process.env.REDIS_CACHE_PASSWORD,
});

/**
 * Connect the redis client, and initiate a log
 */
redis
  .connect()
  .then(() => console.info('redis: [SUCCESS] client connected'))
  .catch(() =>
    console.error('redis: [ERROR] failed to establish a connection'),
  );

export { redis };
