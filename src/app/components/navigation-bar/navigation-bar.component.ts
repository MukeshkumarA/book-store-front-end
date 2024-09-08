import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../../services/user.service';
import { stat } from 'node:fs';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [MatDialogModule, RouterModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent implements OnInit {

  loggedUserName: string | undefined;
  isLoggedIn$: Observable<boolean>;
  loggedRole$: Observable<string>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    // Initialize the observables by assigning the AuthService observables
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.loggedRole$ = this.authService.loggedRole$;

  }

  ngOnInit() {
    console.log("navigation on init");
    this.isLoggedIn$.subscribe((status) => {
      console.log('Login status changed:', status);  // Add this to verify subscription
      if (status) {
        this.setLoggedUserName();
      } else {
        this.loggedUserName = undefined;
      }
    });

    this.loggedRole$.subscribe((role) => {
      console.log('User role changed:', role);  // Add this to verify role changes
    });
  }

  openSignUpDialog(): void {
    this.dialog.open(SignUpComponent, {
      width: '600px',
    });
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '380px',
    });
  }

  goToHome(): void {
    this.router.navigate(['']);
  }

  goToCategories(): void {
    this.router.navigate(['categories']);
  }

  goToAddBookComponent(): void {
    this.router.navigate(['admin/addbook']);
  }

  getUserId() {
    // if (isPlatformBrowser(this.platformId)) {
    //   this.userId = localStorage.getItem('userId');
    // } else {
    //   this.userId = null;
    // }
    // return this.userId;
    return this.authService.getLoggedUserId();
  }

  navigateToProfile(): void {
    const id = this.getUserId();
    this.router.navigate(['/user/profile', id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    alert("Logged out successfully.");
  }

  navigateToCartPage() {
    if (!this.isLoggedIn$) {
      this.router.navigate(['cart']);
    }
    else {
      const id = this.getUserId();
      this.router.navigate(['cart', id]);
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  //  checkLoggedInStatus(){
  //   if(this.authService.isLoggedIn())
  //   {
  //     this.isLoggedIn = true;
  //     this.setLoggedUserName();
  //   }
  // }

  setLoggedUserName(): void {
    const userId = this.getUserId();
    if (userId) {
      this.userService.getUserProfile(parseInt(userId)).subscribe(
        (user) => {
          this.loggedUserName = user.firstName;
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
    }
  }


  isAdminLoggedIn(): Observable<boolean> {
    return this.loggedRole$.pipe(
      map((role: string) => role === 'ADMIN')
    );
  }


  // openDialog(): void {
  //   const dialogRef = this.dialog.open(SignUpComponent, {
  //     width: '250px',
  //   });

  //   // dialogRef.afterClosed().subscribe(result => {
  //   //   console.log('The dialog was closed');
  //   //   this.animal = result;
  //   // });
  // } 

}
