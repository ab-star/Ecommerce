import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  // Define specific error codes or types
  OUT_OF_STOCK_ERR = 'Out_Of_Stock';

  constructor() {}

  /**
   * Handles validation errors (status: 400)
   */
  private handleValidationError(err: any): void {
    if (err.error?.errorCodeType === this.OUT_OF_STOCK_ERR) {
      this.showAlert(err.error?.message);
    } else if (Array.isArray(err.errors?.errors)) {
      const errorMessages = err.errors.errors.map((e: any) => e.message).join(', ');
      this.showAlert(`Validation Error: ${errorMessages}`);
    } else {
      this.showAlert('Validation failed. Please check your input.');
    }
  }

  /**
   * Handles other errors by HTTP status
   */
  private handleHttpError(err: HttpErrorResponse): void {
    const statusHandlers: { [status: number]: () => void } = {
      400: () => this.handleValidationError(err),
      404: () => this.showAlert('Resource not found.'),
      500: () => this.showAlert('Internal server error. Please try again later.'),
    };

    // Use specific handler if it exists, otherwise fallback
    const handler = statusHandlers[err.status];
    if (handler) {
      handler();
    } else {
      this.showAlert(`Unexpected server error: ${err.statusText || 'Unknown error'}`);
    }
  }

  /**
   * Handles client-side or generic errors
   */
  private handleGenericError(error: Error | unknown): void {
    if (error instanceof Error) {
      this.showAlert(`Error: ${error.message}`);
    } else {
      this.showAlert('An unknown error occurred!');
    }
  }

  /**
   * Show alert with error message
   */
  private showAlert(message: string): void {
    alert(message); // Replace snackbar with alert dialog
  }

  /**
   * Main error handler entry point
   */
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleGenericError(error);
    }
  }
}
