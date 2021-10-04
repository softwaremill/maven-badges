import RedisClientWrapper from './redisClientWrapper';
import { AxiosStatic } from 'axios';

const BASE_URI = 'http://img.shields.io';
const TTL = 60 * 60 * 12;

const encode = (input: string) => input.replace(/_/g, '__').replace(/\s/g, '_').replace(/-/g, '--');

export const getBadgeImage = async (axios: AxiosStatic, redisClient: RedisClientWrapper, subject: string, version: string, color: string, format: string, style = 'default') => {
  const url = `${BASE_URI}/badge/${encode(subject)}-${encode(version)}-${encode(color)}.${format}?style=${style}`;
  const serializedImageBuffer = await redisClient.getAsync(url);
  if (serializedImageBuffer) {
    console.log(`serving ${url} badge from cache`);
    await redisClient.expireAsync(url, TTL); // refresh expiry time
    return new Buffer(serializedImageBuffer, 'hex');
  }
  
  const { data: buffer } = await axios.get<any>(url, {
    responseType: 'arraybuffer'
  });
  await redisClient.setAsync(url, buffer.toString('hex'), 'EX', TTL); // sets an expiry time to 12h
  console.log(`saved ${url} badge to cache`);
  return buffer;
}

