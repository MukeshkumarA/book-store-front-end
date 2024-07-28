import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
    console.log('AuthInterceptor instantiated');
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const publicUrls = [
      '/bookstore/api/v1/books/all',
      '/bookstore/api/v1/books/popular',
      '/bookstore/api/v1/books/name/',
      '/bookstore/api/v1/books/isbn/',
      '/bookstore/api/v1/books/group-by-genre'
    ];

    // Check if the request URL matches any of the public URL patterns
    const isPublicUrl = publicUrls.some(url => req.url.startsWith(url));

    if (!isPublicUrl) {
      // If not a public URL, add the Authorization header
         let token: string | null = null;

    // Checking if `localStorage` is available
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('access_token');
    }
      // const token = localStorage.getItem('access_token');
      if (token) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        console.log('Cloned Request with Auth:', cloned);
        return next.handle(cloned);
      }
    }

    // Proceed with the original request if it's public or no token is available
    return next.handle(req);
  }

  

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   let token: string | null = null;

  //   // Checking if `localStorage` is available
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     token = localStorage.getItem('access_token');
  //   }

  //   console.log('Token:', token);

  //   if (token) {
  //     const cloned = req.clone({
  //       headers: req.headers.set('Authorization', `Bearer ${token}`)
  //     });
  //     console.log('Cloned Request:', cloned);
  //     return next.handle(cloned);
  //   } else {
  //     return next.handle(req);
  //   }
  // }

}
