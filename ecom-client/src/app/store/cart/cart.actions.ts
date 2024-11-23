import { createAction, props } from '@ngrx/store';

export const addItemToCart = createAction(
  '[Cart] Add Item to Cart',
  props<{ id: string; quantity: number; price: number; name: string }>()
);

export const removeItemFromCart = createAction(
  '[Cart] Remove Item from Cart',
  props<{ id: string }>()
);

export const updateCartItemQuantity = createAction(
  '[Cart] Update Cart Item Quantity',
  props<{ id: string, quantity: number }>()
);
