const ALLOWED_FORMATS = ['svg', 'png'];

export const validateFormat = (format: string) => ALLOWED_FORMATS.indexOf(format) > -1;
