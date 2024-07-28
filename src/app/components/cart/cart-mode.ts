import { CartItem } from "../../services/cart.service";

export interface Cart {
  id?: number;
  userId?: number;
  cartItems: CartItem[];
  totalPrice: number;
}
