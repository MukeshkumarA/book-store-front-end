import { Injectable } from "@angular/core";
import { Book } from "../components/book-list/book";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { environment } from "../environment/environment";
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
  private url = environment.apiUrl + '/bookstore/api/v1';
  private baseUrl = `${this.url}/cart`;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  // addToCart(cartItem: CartItem): Observable<void> {
  //   if(localStorage.getItem("isUserLoggedIn") === "true") {
  //     return this.apiService.addToCart(cartItem);
  //   }
  //   else {
  //     this.storeItemInSessionCart(cartItem);
  //     return throwError(() => new Error('User not logged in'));
  //   }
  // }


  addToCart(cartItem: CartItem): Observable<void> {
    if (localStorage.getItem("isUserLoggedIn") === "true") {
      const userId = this.authService.getLoggedUserId() as string;
      return this.apiService.getCart(parseInt(userId)).pipe(
        switchMap(cart => {
          const existingItem = cart.cartItems.find(item => item.bookId === cartItem.bookId);
          if (existingItem) {
            // updating the quantity if item already exists
            existingItem.quantity += cartItem.quantity;
            return this.apiService.updateCartItem(existingItem);
          } else {
            // adding as new if not exist
            return this.apiService.addToCart(cartItem);
          }
        }),
        catchError(error => {
          console.error('Failed to add item to cart', error);
          return throwError(() => new Error('Failed to add item to cart'));
        })
      );
    } else {
      this.storeItemInSessionCart(cartItem);
      // return "";
      return throwError(() => new Error('User not logged in'));
    }
  }

  // addToCart(cartItem: CartItem): Observable<void> {
  //   if (localStorage.getItem("isUserLoggedIn") === "true") {
  //     return this.apiService.addToCart(cartItem).pipe(
  //       catchError(error => {
  //         console.error('Add to cart failed', error);
  //         return throwError(() => new Error('Failed to add item to cart.'));
  //       })
  //     );
  //   } else {
  //     this.storeItemInSessionCart(cartItem);
  //     return throwError(() => new Error('User not logged in'));
  //   }
  // }


  getCart(): Observable<Cart> {
    const userId = this.authService.getLoggedUserId();
    if (userId)
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

  storeItemInSessionCart(item: CartItem): void {
    let cart: CartItem[] = JSON.parse(sessionStorage.getItem('sessionCart') || '[]');
    const existingItem = cart.find(cartItem => cartItem.bookId === item.bookId);
  
    if (existingItem) {
      // Update existing item's quantity and totalPrice
      existingItem.quantity = item.quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      // Add new item to cart
      cart.push(item);
    }
  
    sessionStorage.setItem('sessionCart', JSON.stringify(cart));
  }
  
  


  getSessionCart(): CartItem[] {
    return JSON.parse(sessionStorage.getItem('sessionCart') || '[]');
  }

  clearSessionCart(): void {
    sessionStorage.removeItem('sessionCart');
  }

  removeFromSessionCart(item: CartItem): boolean {
    let cartItems: CartItem[] = JSON.parse(sessionStorage.getItem('sessionCart') || '[]');
    const itemIndex = cartItems.findIndex(cartItem => cartItem.bookId === item.bookId);
    if (itemIndex === -1) return false;
    cartItems.splice(itemIndex, 1);
    sessionStorage.setItem('sessionCart', JSON.stringify(cartItems));
    return true;
  }



}