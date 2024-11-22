// import { Request, Response, NextFunction } from 'express';
// import { ApiError } from '../dtos/error.dto';

// export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
//   console.error(err);
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal server error';
//   res.status(statusCode).json(new ApiError(message, err.errors || []));
// }
// // 


import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import {
  ValidationError,
  RepositoryError,
  ServiceError,
  ControllerError,
  GenericError,
} from '../utils/errorCategory';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error('Error occurred', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ValidationError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.details,
    });
  }

  if (err instanceof RepositoryError || err instanceof ServiceError || err instanceof ControllerError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback for any uncategorized errors
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
  });
};
