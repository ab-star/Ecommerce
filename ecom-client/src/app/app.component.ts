import {  Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItemToCart } from './store/cart/cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'ecom-client';

  constructor(private store: Store) {}


  onAddToCart(product: { id: string; name: string; price: number; quantity: number }) {
    // Dispatching action to add the product to the cart
    this.store.dispatch(
      addItemToCart({ id: product.id, quantity: product.quantity , price: product.price , name: product.name })
    );
  }
}
