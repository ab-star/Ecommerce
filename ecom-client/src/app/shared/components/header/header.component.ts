import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectCartItems } from '../../../store/cart/cart.selector'; // Update the import based on your actual file structure

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartItemCount$: Observable<number> = new Observable<number>();  // Initialize with an empty observable

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Select the cart items from the store and get the length of the items
    this.cartItemCount$ = this.store.select(selectCartItems).pipe(
      map((cartItems: any) => cartItems.length)  // Get the count of cart items
    );
  }
}
