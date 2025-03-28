import { validateFormat } from './validation';
import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  private statusCode: number;
  private statusMessage: string;

  constructor(statusCode: number, statusMessage: string) {
    super('Invalid format');
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }
}

export const lowerCaseFormatMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.params.format = req.params.format.toLowerCase();
  next();
};

export const validateFormatMiddleware = (req: Request, res: Response, next: NextFunction) =>
  validateFormat(req.params.format) ? next() : next(new HttpError(415, 'Invalid format'));
