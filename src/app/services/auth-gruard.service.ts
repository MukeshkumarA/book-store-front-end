import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isLoggedIn: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    // this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.canActivate
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn) {
      return true;
    } else {
      // Redirecting to login page if not authenticated
      this.router.navigate(['/']);
      return false;
    }
  }
}
