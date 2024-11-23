import { createReducer, on } from '@ngrx/store';
import { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } from './cart.actions';
import { initialState } from './cart.state';

export const cartReducer = createReducer(
  initialState,

  on(addItemToCart, (state, { id, quantity, price, name }) => {
    const existingItem = state.items.find(item => item.id === id);

    if (existingItem) {
      // Update the existing item if it already exists in the cart
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.price // Recalculate total price based on updated quantity
              }
            : item
        ),
      };
    } else {
      // Add the new item to the cart
      return {
        ...state,
        items: [
          ...state.items,
          {
            id,          // Use id here as per CartItem interface
            name,
            price,
            quantity,
            totalPrice: quantity * price // Calculate total price for new item
          }
        ],
      };
    }
  }),

  on(removeItemFromCart, (state, { id }) => ({
    ...state,
    items: state.items.filter(item => item.id !== id),
  })),

  on(updateItemQuantity, (state, { id, quantity }) => {
    return {
      ...state,
      items: state.items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.price // Recalculate total price after updating quantity
            }
          : item
      ),
    };
  }),

  on(clearCart, state => ({
    ...state,
    items: [],
  }))
);
