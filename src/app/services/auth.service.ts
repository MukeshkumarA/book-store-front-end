import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { environment } from "../environment/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { response } from "express";
import { isPlatformBrowser } from "@angular/common";


@Injectable({
  providedIn: "root"
})
export class AuthService {
 private apiUrl = environment.apiUrl + '/bookstore/api/v1';
  private baseUrl = `${this.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private loggedRole = new BehaviorSubject<string>(this.getStoredRole());

  isLoggedIn$ = this.loggedIn.asObservable();
  loggedRole$ = this.loggedRole.asObservable();

  // isLoggedIn$: Observable<boolean>;
  // loggedRole$: Observable<string>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    // this.loggedRole = new BehaviorSubject<string>(this.getStoredRole());

    // this.isLoggedIn$ = this.loggedIn.asObservable();
    // this.loggedRole$ = this.loggedRole.asObservable();
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  private getStoredRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('loggedUser_role') || '';
    }
    return '';
  }

  register(email: string, password: string, firstName: string, lastName: string, role: string, address: string, phoneNumber: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { email, password, firstName, lastName, role, address, phoneNumber  }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access_token);
        }
        // this.loggedIn.next(true);
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access_token); // token
          localStorage.setItem('logged_userId', response.userId); // userid
          localStorage.setItem('loggedUser_role', response.role); // role
          localStorage.setItem('isUserLoggedIn', "true"); // boolean
          console.log('Login successful, updating subjects');
          this.loggedIn.next(true);
          this.loggedRole.next(response.role);
        }
      }),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('logged_userId');
      localStorage.removeItem('loggedUser_role');
      localStorage.setItem('isUserLoggedIn', "false");
    }
    this.loggedIn.next(false);
    this.loggedRole.next("");
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  getLoggedUserId(): string | undefined {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('logged_userId') || undefined;
    }
    return undefined;
  }

  getLoggedUserRole(): string | undefined {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('loggedUser_role') || undefined;
    }
    return undefined;
  }


}