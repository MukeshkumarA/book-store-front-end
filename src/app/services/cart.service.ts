import { Injectable } from "@angular/core";
import { Book } from "../components/book-list/book";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../environment";
import { Cart } from "../components/cart/cart-mode";
import { ApiService } from "./api-service";
import { AuthService } from "./auth.service";

export interface CartItem {
    id?: number;
    bookId: number;
    title: string;
    book?: Book;
    quantity: number;
    price: number;
    totalPrice: number;
  }
  
@Injectable({
    providedIn: 'root'
})
export class CartService {
    private baseUrl = `${environment.apiUrl}/cart`;

    constructor(private apiService: ApiService, private authService: AuthService) {}
  
    addToCart(cartItem: CartItem): Observable<void> {
      if(localStorage.getItem("isUserLoggedIn") === "true") {
        return this.apiService.addToCart(cartItem);
      }
      else {
        this.storeItemInSessionCart(cartItem);
        return throwError(() => new Error('User not logged in'));
      }
    }

    getCart(): Observable<Cart> {
      const userId = this.authService.getLoggedUserId();
      if(userId)
        return this.apiService.getCart(parseInt(userId));
      else
        return throwError("user not logged in");
    }
  
    updateCartItem(cartItem: CartItem): Observable<void> {
      return this.apiService.updateCartItem(cartItem);
    }
  
    removeFromCart(bookId: number): Observable<void> {
      return this.apiService.removeFromCart(bookId);
    }

    clearCart(): Observable<string> {
      return this.apiService.clearCart();
    }
  
    checkoutCart(): Observable<string> {
      return this.apiService.checkoutCart();
    }  

    protected storeItemInSessionCart(item: CartItem): void {
      let cart = JSON.parse(sessionStorage.getItem('sessionCart') || '[]');
      cart.push(item);
      sessionStorage.setItem('sessionCart', JSON.stringify(cart));
    }

    getSessionCart(): CartItem[] {
      return JSON.parse(sessionStorage.getItem('sessionCart') || '[]');
    }
  
    clearSessionCart(): void {
      sessionStorage.removeItem('sessionCart');
    }

    removeFromSessionCart(item: CartItem): boolean {
      // Get the current cart from session storage
      let cartItems:CartItem[] = JSON.parse(sessionStorage.getItem('sessionCart') || '[]');
    
      // Find the index of the item to remove
      const itemIndex = cartItems.findIndex(item => item.bookId === item.bookId);
    
      if (itemIndex === -1) {
        // Item not found
        return false;
      }
    
      // Remove the item from the cart
      cartItems.splice(itemIndex, 1);
    
      // Save the updated cart back to session storage
      sessionStorage.setItem('sessionCart', JSON.stringify(cartItems));
    
      return true;
    }

  
}