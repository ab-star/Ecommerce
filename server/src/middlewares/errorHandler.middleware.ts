import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';  // Assuming logger is set up to log errors to a file or external service
import { ApiError } from '../dtos/error.dto';  // Assuming ApiError is a DTO that standardizes error responses

// Import custom error categories
import { 
  ValidationError,
  NotFoundError,
  RepositoryError,
  ServiceError,
  ControllerError,
} from '../utils/errorCategory';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error details for debugging purposes
  // logger.error('Error occurred', {
  //   name: err.name,
  //   message: err.message,
  //   stack: err.stack,
  //   path: req.path,
  //   method: req.method,
  // });

  // Check if the error is an instance of one of our custom error categories
  if (err instanceof ValidationError) {
    // Handle validation errors (e.g., for input validation)
    return res.status(err.statusCode || 400).json(new ApiError(err.message , err.details));
  }

  if (err instanceof NotFoundError) {
    // Handle "not found" errors (e.g., trying to access a non-existing resource)
    return res.status(err.statusCode || 404).json(new ApiError(err.message));
  }

  if (err instanceof RepositoryError || err instanceof ServiceError || err instanceof ControllerError) {
    // Handle repository, service, or controller specific errors (database, logic, or flow issues)
    return res.status(err.statusCode || 500).json(new ApiError(err.message));
  }

console.log(err , 'errr')
  return res.status(err.statusCode || 500).json(new ApiError('An unexpected error occurred'));

};
