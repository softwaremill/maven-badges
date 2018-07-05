import { validateFormat } from './validation';
import { Request, Response, NextFunction } from 'express';

export const lowerCaseFormatMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.params.format = req.params.format.toLowerCase();
  next();
};

export const validateFormatMiddleware = (req: Request, res: Response, next: NextFunction) =>
  validateFormat(req.params.format) ? next() : res.sendStatus(415);
