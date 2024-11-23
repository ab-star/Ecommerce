import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  // Define specific error codes or types
  OUT_OF_STOCK_ERR = 'Out_Of_Stock';

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Handles validation errors (status: 400)
   */
  private handleValidationError(err: any): void {
    if (err.error?.errorCodeType === this.OUT_OF_STOCK_ERR) {
      this.showSnackBar(err.error?.message, 'error-snackbar');
    } else if (Array.isArray(err.errors?.errors)) {
      const errorMessages = err.errors.errors.map((e: any) => e.message).join(', ');
      this.showSnackBar(`Validation Error: ${errorMessages}`, 'error-snackbar');
    } else {
      this.showSnackBar('Validation failed. Please check your input.', 'error-snackbar');
    }
  }

  /**
   * Handles other errors by HTTP status
   */
  private handleHttpError(err: HttpErrorResponse): void {
    const statusHandlers: { [status: number]: () => void } = {
      400: () => this.handleValidationError(err),
      404: () => this.showSnackBar('Resource not found.', 'error-snackbar'),
      500: () => this.showSnackBar('Internal server error. Please try again later.', 'error-snackbar'),
    };

    // Use specific handler if it exists, otherwise fallback
    const handler = statusHandlers[err.status];
    if (handler) {
      handler();
    } else {
      this.showSnackBar(`Unexpected server error: ${err.statusText || 'Unknown error'}`, 'error-snackbar');
    }
  }

  /**
   * Handles client-side or generic errors
   */
  private handleGenericError(error: Error | unknown): void {
    if (error instanceof Error) {
      this.showSnackBar(`Error: ${error.message}`, 'error-snackbar');
    } else {
      this.showSnackBar('An unknown error occurred!', 'error-snackbar');
    }
  }

  /**
   * Show snackbar with consistent styling
   */
  private showSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
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
