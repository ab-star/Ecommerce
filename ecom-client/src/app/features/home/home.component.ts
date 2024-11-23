import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItemToCart } from '../../store/cart/cart.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private store: Store) {}

  // Method to handle the emitted cart item and dispatch to store
  onAddToCart(product: { id: string; name: string; price: number; quantity: number }) {
    // Dispatching action to add the product to the cart
    this.store.dispatch(
      addItemToCart({ id: product.id, quantity: product.quantity , price: product.price , name: product.name })
    );
  }
}
