import { AxiosStatic } from 'axios';
import { RedisClient } from '../main';

const BASE_URI = 'http://img.shields.io';
const TTL = 60 * 60 * 12;

const encode = (input: string) => input.replace(/_/g, '__').replace(/\s/g, '_').replace(/-/g, '--');

export const getBadgeImage = async (axios: AxiosStatic, redisClient: RedisClient, subject: string, version: string, color: string, format: string, style = 'default') => {
  const url = `${BASE_URI}/badge/${encode(subject)}-${encode(version)}-${encode(color)}.${format}?style=${style}`;

  try {
    const serializedImageBuffer = await redisClient.get(url);
    if (serializedImageBuffer) {
      console.log(`serving ${url} badge from cache`);
      await redisClient.expire(url, TTL); // refresh expiry time
      return Buffer.from(serializedImageBuffer, 'hex');
    }

    const { data: buffer } = await axios.get<any>(url, {
      responseType: 'arraybuffer'
    });

    await redisClient.set(url, buffer.toString('hex'), { EX: TTL }); // sets an expiry time to 12h
    console.log(`saved ${url} badge to cache`);
    return buffer;
  } catch (error) {
    console.log(error);
  }
}
