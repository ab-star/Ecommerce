import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItemToCart } from '../../store/cart/cart.actions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  searchQuery: string = '';  // Store the search query

  constructor(private store: Store , private toastr: ToastrService) {}

  // Listen for the event emitted from Product component and dispatch to NgRx store
  onAddToCart(product: any) {
    this.store.dispatch(addItemToCart({
      id: product.id,
      quantity: 1,
      price: product.price,
      name: product.name,
    }));
  }

  onSearchQueryChange(searchQuery: string): void {
    this.searchQuery = searchQuery;
  }
}
