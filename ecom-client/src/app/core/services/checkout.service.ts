import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OrderRequest } from '../../types/order.type';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = "/sales-order"
  constructor(private apiService: ApiService) { }

  createOrder(req: OrderRequest){
    return this.apiService.post(this.baseUrl, req)
    // .pipe(catchError((err: any)=>{
    //     if(err.statusCode == 400 && err.errorCodeType == "Out_ofStock"){

    //     }
    // }))
  }
}
