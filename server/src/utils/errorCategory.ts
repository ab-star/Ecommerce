export class ValidationError extends Error {
    public status: number;
    public details: any;
  
    constructor(message: string, details: any) {
      super(message);
      this.name = 'ValidationError';
      this.status = 400;
      this.details = details;
    }
  }
  
  export class RepositoryError extends Error {
    public status: number;
  
    constructor(message: string) {
      super(message);
      this.name = 'RepositoryError';
      this.status = 500;
    }
  }
  
  export class ServiceError extends Error {
    public status: number;
  
    constructor(message: string) {
      super(message);
      this.name = 'ServiceError';
      this.status = 500;
    }
  }
  
  export class ControllerError extends Error {
    public status: number;
  
    constructor(message: string) {
      super(message);
      this.name = 'ControllerError';
      this.status = 500;
    }
  }
  
  export class GenericError extends Error {
    public status: number;
  
    constructor(message: string) {
      super(message);
      this.name = 'GenericError';
      this.status = 500;
    }
  }
  