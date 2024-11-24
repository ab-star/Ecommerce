import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, OnInit } from '@angular/core';
import { ProductService } from './products.service';
import { finalize, Observable, debounceTime, switchMap, catchError, of, Subject, distinctUntilChanged } from 'rxjs';
import { ProductResponse } from '../../../types/product.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnChanges, OnInit {
  @Input() searchQuery: string = '';  // Accept search query from parent component
  @Output() cartUpdated: EventEmitter<any> = new EventEmitter();  // If you want to emit cart updates
  products$: Observable<ProductResponse> = new Observable<ProductResponse>();
  pageSize: number = 4;
  pageIndex: number = 0;
  loading = false;
  private searchSubject: Subject<string> = new Subject<string>(); // Subject to handle search input

  constructor(
    public productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.searchSubject.next(this.searchQuery);  // Emit search query whenever it changes
    }
  }

  ngOnInit(): void {
    // Fetch initial products when the component loads
    this.fetchProducts();

    // Set up the searchSubject pipeline for throttling and race condition handling
    this.searchSubject.pipe(
      debounceTime(500),  // Throttle input, wait for 500ms after typing
      distinctUntilChanged(),  // Only trigger search if query is different from previous
      switchMap((searchQuery) => {
        this.loading = true; // Set loading to true before API call
        return this.productService.getProducts(this.pageIndex + 1, this.pageSize, searchQuery).pipe(
          catchError(() => {
            this.toastr.error('Failed to fetch products', 'Error');
            return of({ data: { products: [] } });  // Return an empty list in case of error
          }),
          finalize(() => {
            this.loading = false;  // Turn off loading when the request completes
          })
        );
      })
    ).subscribe((response: any) => {
      this.products$ = of(response); // Update the products observable with the fetched products
    });
  }

  // Fetch products for the current page (initial fetch and pagination)
  fetchProducts(): void {
    this.loading = true; // Set loading to true before API call
    this.productService.getProducts(this.pageIndex + 1, this.pageSize, this.searchQuery).pipe(
      catchError(() => {
        this.toastr.error('Failed to fetch products', 'Error');
        return of({ data: { products: [] } });  // Return an empty list in case of error
      }),
      finalize(() => {
        this.loading = false;  // Turn off loading when the request completes
      })
    ).subscribe((response: any) => {
      this.products$ = of(response); // Update the products observable with the fetched products
    });
  }

  // Handle pagination change
  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchProducts(); // Fetch products based on updated pagination
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
