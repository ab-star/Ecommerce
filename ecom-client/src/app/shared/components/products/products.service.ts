import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../models/product';
import { ProductResponse } from '../../../types/product.type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'master-products'; // Endpoint for fetching products

  constructor(private apiService: ApiService) {}

  // GET request to fetch products with pagination
  getProducts(page: number = 1, limit: number = 4): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.apiService.get<any>(this.baseUrl, params)
  }
}
