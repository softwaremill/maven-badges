import * as redis from 'redis';
import { PORT, REDIS_URL } from './config';
import { createServer } from './server';
import RedisClientWrapper from './services/redisClientWrapper';

const redisClientWrapper = new RedisClientWrapper(redis.createClient(REDIS_URL));

const app = createServer(redisClientWrapper);

app.listen(PORT, () => {
  console.log(`server ready on port ${PORT}`);
});
