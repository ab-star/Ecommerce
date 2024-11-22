// Base Custom Error Class
export class CustomError extends Error {
  public statusCode: number;
  public originalError?: Error | unknown;

  constructor(message: string, status: number, originalError?: Error | unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = status;

    // Capture the original error if provided
    if (originalError) {
      this.originalError = originalError;
    }
  }

  // Helper to identify if the original error is of a specific type
  isOriginalErrorType(type: Function): boolean {
    return this.originalError instanceof type;
  }
}

// Validation Error Class
export class ValidationError extends CustomError {
  public details: any;

  constructor(message: string, details: any, originalError?: Error | unknown) {
    super(message, 400, originalError);
    this.details = details;
  }
}

// Not Found Error Class
export class NotFoundError extends CustomError {
  constructor(message: string, originalError?: Error | unknown) {
    super(message, 404, originalError);
  }
}

// Repository Error Class
export class RepositoryError extends CustomError {
  constructor(message: string, originalError?: Error | unknown) {
    super(message, 500, originalError);
  }
}

// Service Error Class
export class ServiceError extends CustomError {
  constructor(message: string, originalError?: Error| unknown) {
    super(message, 500, originalError);
  }

  // Helper specific to ServiceError for identifying RepositoryError
  isRepositoryError(): boolean {
    return this.isOriginalErrorType(RepositoryError);
  }
}

// Controller Error Class
export class ControllerError extends CustomError {
  constructor(message: string, originalError?: Error) {
    super(message, 500, originalError);
  }
}
