import { Injectable } from "@angular/core";
import { Book } from "../components/book-list/book";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { environment } from "../environment/environment";
import { Cart } from "../components/cart/cart-mode";
import { ApiService } from "./api-service";
import { AuthService } from "./auth.service";
import { UserNotLoggedInError } from "../userNotLoggedInError";

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
  
      // Directly attempt to add the cart item; the backend will handle the cart creation if it doesn't exist
      // return this.apiService.addToCart(cartItem).pipe(
      //   catchError(error => {
      //     console.error('Failed to add item to cart', error);
      //     return throwError(() => new Error('Failed to add item to cart'));
      //   })
      // );
      return this.apiService.addToCart(cartItem);
    } else {
      this.storeItemInSessionCart(cartItem);
      return throwError(() => new UserNotLoggedInError());
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
    let cart: CartItem[] = JSON.parse(localStorage.getItem('sessionCart') || '[]');
    const existingItem = cart.find(cartItem => cartItem.bookId === item.bookId);
  
    if (existingItem) {
      // Update existing item's quantity and totalPrice
      existingItem.quantity += item.quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      // Add new item to cart
      cart.push(item);
    }

    localStorage.setItem('sessionCart', JSON.stringify(cart));
    // sessionStorage.setItem('sessionCart', JSON.stringify(cart));
  }
  


  getSessionCart(): CartItem[] {
    console.log(localStorage.getItem('sessionCart'));
    return JSON.parse(localStorage.getItem('sessionCart') || '[]');
  }

  clearSessionCart(): boolean {
    if(localStorage.getItem('sessionCart') != undefined)
    {
      localStorage.removeItem('sessionCart');
      return true;
    }

    return false;
  }

  removeFromSessionCart(item: CartItem): boolean {
    let cartItems: CartItem[] = JSON.parse(localStorage.getItem('sessionCart') || '[]');
    const itemIndex = cartItems.findIndex(cartItem => cartItem.bookId === item.bookId);
    if (itemIndex === -1) return false;
    cartItems.splice(itemIndex, 1);
    localStorage.setItem('sessionCart', JSON.stringify(cartItems));
    return true;
  }



}