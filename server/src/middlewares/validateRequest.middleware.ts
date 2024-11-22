import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../utils/errorCategory';

export const validateRequest = (schemas: {
  body?: z.ZodSchema<any>;
  query?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body if schema provided
      if (schemas.body) {
        schemas.body.parse(req.body);
      }

      // Validate query if schema provided
      if (schemas.query) {
        schemas.query.parse(req.query);
      }

      // Validate params if schema provided
      if (schemas.params) {
        schemas.params.parse(req.params);
      }

      next(); // Proceed to the next middleware if validation passes
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((err) => ({
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

