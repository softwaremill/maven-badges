import { createClient } from 'redis';
import axios from 'axios';
import { PORT, REDIS_URL } from './config';
import { createServer } from './server';

const redisClient = createClient({ url: REDIS_URL });

export type RedisClient = typeof redisClient;

redisClient.connect().then(() => {
  const app = createServer(axios, redisClient);
  
  app.listen(PORT, () => {
    console.log(`server ready on port ${PORT}`);
  });
});
