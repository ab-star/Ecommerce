import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the schema
      schema.parse(req.body);
      next(); // If validation passes, continue to the next middleware or controller
    } catch (error) {
      if (error instanceof ZodError) {
        // If validation fails, return an error response
        const errorMessages = error.errors.map(err => err.message);
        return res.status(400).json({ success: false, errors: errorMessages });
      }
      // If error is unexpected, pass it to the global error handler
      next(error);
    }
  };
};

export { validateRequest };
