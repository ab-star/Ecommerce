import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from './products.service';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../../types/product.type';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$: Observable<ProductResponse> = new Observable<ProductResponse>();  // Declare as Observable
  pageSize: number = 4; // Default page size
  pageIndex: number = 0; // Default page index

  @Output() cartUpdated: EventEmitter<any> = new EventEmitter();

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    // Load initial set of products with default page index and size
    this.loadProducts();
  }

  // Method to load products with pagination
  loadProducts(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    this.products$ = this.productService.getProducts(pageIndex + 1, pageSize); // API uses 1-based index
  }

  // Handle pagination change
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;  // Update the page index
    this.pageSize = event.pageSize;    // Update the page size
    this.loadProducts(this.pageIndex, this.pageSize);  // Reload the products
  }

  // Emit product data when adding to cart
  addToCart(product: any) {
    this.cartUpdated.emit({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      quantity: 0
    });
  }
}
