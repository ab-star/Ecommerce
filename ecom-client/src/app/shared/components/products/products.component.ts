import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products = [
    { id: 1, name: 'Product 1', description: 'Description of Product 1', price: 10.0, quantity: 1 },
    { id: 2, name: 'Product 2', description: 'Description of Product 2', price: 15.0, quantity: 1 },
    { id: 3, name: 'Product 3', description: 'Description of Product 3', price: 20.0, quantity: 1 },
    { id: 4, name: 'Product 4', description: 'Description of Product 4', price: 25.0, quantity: 1 },
  ];

  @Output() cartUpdated: EventEmitter<any> = new EventEmitter();

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
