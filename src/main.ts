import { createClient, RedisClientType } from 'redis';
import axios from 'axios';
import { PORT, REDIS_URL, REDIS_PASSWORD } from './config';
import { createServer } from './server';

const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
  password: REDIS_PASSWORD,
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
