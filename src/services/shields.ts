import { AxiosStatic } from 'axios';
import { RedisClientType } from 'redis';
import { Logger } from "heroku-logger";

const BASE_URI = 'http://img.shields.io';
const TTL = 60 * 60 * 12;

const logger = new Logger({ prefix: 'shields: ' });

const encode = (input: string) => input.replace(/_/g, '__').replace(/\s/g, '_').replace(/-/g, '--');

export const getBadgeImage = async (axios: AxiosStatic, redisClient: RedisClientType, subject: string, version: string, color: string, format: string, style = 'default') => {
  const url = `${BASE_URI}/badge/${encode(subject)}-${encode(version)}-${encode(color)}.${format}?style=${style}`;

  try {
    const serializedImageBuffer = await redisClient.get(url);
    if (serializedImageBuffer) {
      logger.info(`Serving ${url} badge from cache`);
      await redisClient.expire(url, TTL); // refresh expiry time
      return Buffer.from(serializedImageBuffer, 'hex');
    }

    const { data: buffer } = await axios.get<any>(url, {
      responseType: 'arraybuffer'
    });

    await redisClient.set(url, buffer.toString('hex'), { EX: TTL }); // sets an expiry time to 12h
    logger.info(`saved ${url} badge to cache`);
    return buffer;
  } catch (error) {
    logger.error(`Error when preparing a badge [${url}]: ${error}`);
  }
}
