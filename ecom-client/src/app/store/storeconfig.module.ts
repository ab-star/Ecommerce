import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { cartReducer } from './cart/cart.reducer';

@NgModule({
  imports: [
    StoreModule.forRoot({ cart: cartReducer }),
    EffectsModule.forRoot([]),
  ],
})
export class StoreModuleConfig {}
