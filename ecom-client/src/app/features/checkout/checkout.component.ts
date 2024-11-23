import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../store/cart/cart.state';
import { addItemToCart, removeItemFromCart, updateCartItemQuantity } from '../../store/cart/cart.actions';
import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selector';
import { CheckoutService } from '../../core/services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;

  constructor(private fb: FormBuilder, private store: Store , private checkOutService: CheckoutService) {
    // Use selectors to get the state
    this.cartItems$ = this.store.select(selectCartItems);
    this.totalPrice$ = this.store.select(selectCartTotal);
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

  // Increase quantity
  increaseQuantity(item: CartItem) {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    this.store.dispatch(updateCartItemQuantity({ id: item.id, quantity: updatedItem.quantity }));
  }

  // Decrease quantity
  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      this.store.dispatch(updateCartItemQuantity({ id: item.id, quantity: updatedItem.quantity }));
    }
  }

  // Remove item from cart
  removeItem(item: CartItem) {
    this.store.dispatch(removeItemFromCart({ id: item.id }));
  }

  orderCreate(){
    const reqBody = {...this.checkoutForm.value}
    reqBody.products = this.cartItems$.map((item)=>{
      return {productId: item.id , quantity: item.quantity}
    })

    this.checkOutService.createOrder(req)
  }
}
