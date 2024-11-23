import { createAction, props } from '@ngrx/store';

export const addItemToCart = createAction(
  '[Cart] Add Item',
  props<{ id: string; quantity: number; price: number; name: string }>()
);

export const removeItemFromCart = createAction(
  '[Cart] Remove Item',
  props<{ id: string }>()
);

export const updateItemQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ id: string; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear');
