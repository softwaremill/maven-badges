import { promisify } from 'util';
import { RedisClient } from 'redis';

export default class RedisClientWrapper {
  getAsync: (key: string) => Promise<any>;
  setAsync: (key: string, value: any, cmd?: string, cmdArg?: any) => Promise<any>;
  expireAsync: (key: string, seconds: number) => Promise<any>;
  
  constructor (private redisClient: RedisClient) {
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
    this.expireAsync = promisify(this.redisClient.expire).bind(this.redisClient);
  }
}
