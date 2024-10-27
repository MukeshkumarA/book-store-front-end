import { Injectable } from "@angular/core";
import { environment } from "../environment/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Book } from "../components/book-list/book";
import { Cart } from "../components/cart/cart-mode";
import { CartItem } from "./cart.service";
import { NgForm } from "@angular/forms";
import { User } from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.apiUrl;
  private baseUrl = this.url + '/bookstore/api/v1';

  // private _headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private httpClient: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.baseUrl}/books/all`)
  }

  getBookByIsbn(isbn: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.baseUrl}/isbn/${isbn}`);
  }

  getBookById(id: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  getPopularBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.baseUrl}/books/popular`);
  }

  addBook(book: Book, headers: HttpHeaders): Observable<Book> {
    return this.httpClient.post<Book>(`${this.baseUrl}/books`, book, { headers });
  }

  getUserProfile(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  updateUserProfile(userId: number, user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/users/${userId}`, user); 
  }

  addToCart(cartItem: CartItem): Observable<void> {
      return this.httpClient.post<void>(`${this.baseUrl}/cart/add`, cartItem);
  }

  getCart(userId: number): Observable<Cart> {
    return this.httpClient.get<Cart>(`${this.baseUrl}/cart/${userId}`);
  }

  updateCartItem(cartItem: CartItem): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/cart/update`, cartItem);
  }

  removeFromCart(bookId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/cart/remove/${bookId}`);
  }

  checkoutCart(): Observable<string> {
    return this.httpClient.post<string>(`${this.baseUrl}/cart/checkout`, {});
  }  

  clearCart(): Observable<string> {
    // return this.httpClient.delete<string>(`${this.baseUrl}/cart/clearcart`);
    return this.httpClient.delete(`${this.baseUrl}/cart/clearcart`, { responseType: 'text' });

  }

  createCart(userId: number): Observable<Cart> {
    return this.httpClient.post<Cart>(`${this.baseUrl}/cart/create`, { userId });
  }

}