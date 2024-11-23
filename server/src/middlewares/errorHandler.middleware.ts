import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger'; // Assuming logger is set up to log errors
import { ApiError } from '../dtos/error.dto'; // Assuming ApiError is a standardized error response DTO
import {
  ValidationError,
  NotFoundError,
  RepositoryError,
  ServiceError,
  ControllerError,
  OutOfStockError,
} from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE } from '../constants/error.constants';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error for debugging
  logger.error('Error occurred', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine the status code and response message
  let statusCode = 500;
  let response: any = {};
  const Out_Of_Stock = "Out_Of_Stock"

  if(err instanceof ServiceError){
    const errorType = err?.originalError

    if (errorType instanceof ValidationError) {
      statusCode = errorType.statusCode || 400; // Bad Request for validation errors
      response = new ApiError(errorType.message, errorType.details);
    }else if (errorType instanceof OutOfStockError) {
      statusCode = errorType.statusCode || 400; // Bad Request for validation errors
      const respObj = new ApiError(errorType.message);
      response = {...respObj}
      response.errorCodeType = Out_Of_Stock
    } else if (errorType instanceof NotFoundError) {
      statusCode = errorType.statusCode || 404; // Not Found for missing resources
      response = new ApiError(errorType.message);
    } else if (errorType instanceof RepositoryError) {
      statusCode = errorType.statusCode || 500; // Not Found for missing resources
      response = new ApiError(errorType.message);
    } 
  } else if (err instanceof ValidationError) {
    statusCode = err.statusCode || 400; // Bad Request for validation errors
    response = new ApiError(err.message, err.details);
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode || 404; // Not Found for missing resources
    response = new ApiError(err.message);
  } else {
    statusCode =  500; // Internal Server Error for logical issues
    response = new ApiError(GENERIC_ERROR_MESSAGE);
  } 

  // Send the response
  res.status(statusCode).json(response);
};
