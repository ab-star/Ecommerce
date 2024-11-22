import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../utils/errorCategory';

export const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        next(new ValidationError('Request validation failed', errorDetails));
      } else {
        next(error);
      }
    }
  };
};
