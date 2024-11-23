import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CartItem } from '../../store/cart/cart.state';
import { addItemToCart, removeItemFromCart, updateCartItemQuantity } from '../../store/cart/cart.actions';
import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selector';
import { CheckoutService } from '../../core/services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;
  cartItems: CartItem[] = []; // Holds the real-time cart items
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private store: Store, private checkOutService: CheckoutService , private router: Router) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.totalPrice$ = this.store.select(selectCartTotal);
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    // Subscribe to the cart items observable
    this.subscription.add(
      this.cartItems$.subscribe((items) => {
        this.cartItems = items;
        this.validateCart(); // Custom method to check if there's at least one item
      })
    );
  }

  validateCart() {
    if (this.cartItems.length === 0) {
      this.checkoutForm.setErrors({ noItems: true }); // Set form-level error
    } else {
      this.checkoutForm.setErrors(null); // Clear the error
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      let headerPayload = this.checkoutForm.value
      let payload = {
        ...headerPayload,
        products: this.cartItems?.map((item)=>{
          return {productId: item.id , quantity: item.quantity}
        })
      }
      this.checkOutService.createOrder(payload).subscribe((item)=>{
        this.router.navigate(['/']);
      })
    } else {
      alert('Please fill out all required fields and ensure your cart has items!');
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

}
