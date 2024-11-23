import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItemToCart } from '../../store/cart/cart.actions';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private store: Store) {}

  // Listen for the event emitted from Product component and dispatch to NgRx store
  onAddToCart(product: any) {
    this.store.dispatch(addItemToCart({
      id: product.id,
      quantity: product.quantity,
      price: product.price,
      name: product.name,
    }));
  }
}
