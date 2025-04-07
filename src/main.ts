import { createClient, RedisClientType } from 'redis';
import axios from 'axios';
import { config } from './config';
import { createServer } from './server';

const redisClient: RedisClientType = createClient({
  url: config.redisUrl,
  socket: {
    tls: (config.redisUrl.match(/rediss:/) != null),
    rejectUnauthorized: false,
  }
});

if (config.isRedirect()) {
  const app = createServer(axios, redisClient);

  app.listen(config.port, () => {
    console.log(`Server ready on port ${config.port}`);
  });
} else {
  redisClient.connect().then(() => {
    const app = createServer(axios, redisClient);

    app.listen(config.port, () => {
      console.log(`Server ready on port ${config.port}`);
    });
  });
}
