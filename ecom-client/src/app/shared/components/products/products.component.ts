import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from './products.service';
import { Observable, of } from 'rxjs';
import { ProductResponse } from '../../../types/product.type';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit  {
  products$: Observable<ProductResponse> = of({} as ProductResponse); ;  // Declare as Observable

  constructor(public productService: ProductService){}

  @Output() cartUpdated: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.products$ = this.productService.getProducts(1, 4);
  }

  // Emit product data when adding to cart
  addToCart(product: any) {
    if (product.quantity > 0) {
      this.cartUpdated.emit({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: product.quantity 
      });
      product.quantity = 0; // Reset quantity after adding to cart
    } else {
      console.log('Please increase quantity before adding to cart');
    }
  }
}
