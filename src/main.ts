import { createClient, RedisClientType } from 'redis';
import axios from 'axios';
import { PORT, REDIS_URL } from './config';
import { createServer } from './server';

const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
  socket: {
    tls: (REDIS_URL.match(/rediss:/) != null),
    rejectUnauthorized: false,
  }
});

redisClient.connect().then(() => {
  const app = createServer(axios, redisClient);

  app.listen(PORT, () => {
    console.log(`server ready on port ${PORT}`);
  });
});
