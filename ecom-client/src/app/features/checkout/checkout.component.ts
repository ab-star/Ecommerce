import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../store/cart/cart.state'
import { addItemToCart } from '../../store/cart/cart.actions';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;

  constructor(private fb: FormBuilder, private store: Store<{ cart: { items: CartItem[] } }>) {
    this.cartItems$ = this.store.select((state) => state.cart.items)
    this.store.select((state) => state.cart.items).subscribe((item)=>console.log(item , 'aaaadddd disp'));
    console.log(this.cartItems$ , 'carttttt')
    this.totalPrice$ = this.store.select((state) =>
      state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log('Order Placed:', {
        userDetails: this.checkoutForm.value,
        cart: this.cartItems$,
      });
      alert('Order placed successfully!');
    } else {
      alert('Please fill out all required fields!');
    }
  }

 
}
