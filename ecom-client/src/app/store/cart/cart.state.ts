

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number; // Total price for this product (price * quantity)
}

export interface CartState {
  items: CartItem[];
}

export const initialState: CartState = {
  items: []
};