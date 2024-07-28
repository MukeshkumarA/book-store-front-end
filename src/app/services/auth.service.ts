import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { response } from "express";


@Injectable({
  providedIn: "root"
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { email, password, firstName, lastName }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token); // token
        localStorage.setItem('logged_userId', response.userId); // userid
        localStorage.setItem('loggedUser_role', response.role); // role
        localStorage.setItem('isUserLoggedIn', "true"); // boolean
      }),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('logged_userId');
    localStorage.removeItem('loggedUser_role');
    localStorage.setItem('isUserLoggedIn', "false");
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  isLoggedIn(){
    return (localStorage.getItem("isUserLoggedIn") == 'true') ? true : false;
  }

  getLoggedUserId() {
    if(localStorage.getItem('logged_userId'))
      return localStorage.getItem('logged_userId');
    return undefined;
  }

  getLoggedUserRole() {
    if(localStorage.getItem('loggedUser_role'))
      return localStorage.getItem('loggedUser_role');
    return undefined;
  }

  

}