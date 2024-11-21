export class ApiError {
    success: boolean;
    message: string;
    errors?: any[];
  
    constructor(message: string, errors?: any[]) {
      this.success = false;
      this.message = message;
      this.errors = errors;
    }
  }
  