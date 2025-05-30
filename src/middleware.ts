import { validateFormat } from './validation';
import { NextFunction, Request, Response } from 'express';
import { config } from "./config";
import { Logger } from "heroku-logger";

const logger = new Logger({prefix: 'middleware: '});

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

export const optionalRedirect = (req: Request, res: Response, next: NextFunction) => {
  if (config.isRedirect()) {
    logger.info(`Redirecting traffic to: ${config.redirectUrl}`)
    res.redirect(301, `${config.redirectUrl}${req.originalUrl}`)
  } else {
    next()
  }
};
