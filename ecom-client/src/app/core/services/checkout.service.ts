import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OrderRequest } from '../../types/order.type';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = "sales-orders"
  OUT_OF_STOCK_ERR = "Out_Of_Stock"
  constructor(private apiService: ApiService , private snackBar: MatSnackBar) { }

  createOrder(req: OrderRequest) {
    return this.apiService.post(this.baseUrl, req)
  }
}
