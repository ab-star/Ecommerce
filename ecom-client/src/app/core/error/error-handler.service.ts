// src/app/core/services/error-handler.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';  // For showing snack bar messages

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any): void {
    // let errorMessage = 'An unknown error occurred!';

    // if (error instanceof HttpErrorResponse) {
    //   // Handle HTTP errors
    //   if (error.error instanceof ErrorEvent) {
    //     // Client-side errors
    //     errorMessage = `Client-side error: ${error.error.message}`;
    //   } else {
    //     // Backend errors
    //     switch (error.status) {
    //       case 404:
    //         errorMessage = 'Resource not found.';
    //         break;
    //       case 500:
    //         errorMessage = 'Internal server error. Please try again later.';
    //         break;
    //       default:
    //         errorMessage = `Server error: ${error.statusText}`;
    //     }
    //   }
    // } else if (error instanceof Error) {
    //   // Handle non-HTTP errors
    //   errorMessage = `Error: ${error.message}`;
    // }

    // // Log the error (you can also send it to an error logging service)
    // console.error(error);

    // // Show a snack bar message to the user
    // this.snackBar.open(errorMessage, 'Close', {
    //   duration: 3000,
    //   horizontalPosition: 'right',
    //   verticalPosition: 'top',
    // });
  }
}
