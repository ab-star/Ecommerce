import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from './products.service';
import { finalize, Observable, shareReplay } from 'rxjs';
import { ProductResponse } from '../../../types/product.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$: Observable<ProductResponse> = new Observable<ProductResponse>();  // Declare as Observable
  pageSize: number = 4; // Default page size
  pageIndex: number = 0; // Default page index
  loading = false
  @Output() cartUpdated: EventEmitter<any> = new EventEmitter();

  constructor(public productService: ProductService , private toastr : ToastrService) {}

  ngOnInit(): void {
    // Load initial set of products with default page index and size
    this.loadProducts();
  }

  // Method to load products with pagination
  loadProducts(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    this.loading = true; // Set loading to true before API call
    this.products$ = this.productService
      .getProducts(pageIndex + 1, pageSize) // API uses 1-based index
      .pipe(
        shareReplay(1), // Share the same result with multiple subscribers
        finalize(() => (this.loading = false)) // Turn off loading state after API call
      );
  }

  // Handle pagination change
  onPageChange(event: { pageIndex: number, pageSize: number }): void {
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
    this.toastr.success('Product added to the cart.', 'Product Added');
  }
}
