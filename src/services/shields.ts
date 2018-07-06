import axios from 'axios';

const BASE_URI = 'http://img.shields.io';

const encode = (input: string) => input.replace(/_/g, '__').replace(/\s/g, '_').replace(/-/g, '--');

export const getBadgeImage = async (subject: string, version: string, color: string, format: string, style = 'default') => {
  const url = `${BASE_URI}/badge/${encode(subject)}-${encode(version)}-${encode(color)}.${format}?style=${style}`;
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  return data;
}

