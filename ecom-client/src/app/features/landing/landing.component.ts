import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItemToCart } from '../../store/cart/cart.actions';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  constructor(private store: Store) {}


  onAddToCart(product: { id: string; name: string; price: number; quantity: number }) {
    // Dispatching action to add the product to the cart
    console.log(product , "gottittt")
    this.store.dispatch(
      addItemToCart({ id: product.id, quantity: product.quantity , price: product.price , name: product.name })
    );
  }
}
