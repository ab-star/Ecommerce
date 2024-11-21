import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../dtos/error.dto';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json(new ApiError(message, err.errors || []));
}
