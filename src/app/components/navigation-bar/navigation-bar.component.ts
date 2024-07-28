import { Component } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogConfig} from '@angular/material/dialog';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {


  constructor(private dialog: MatDialog, private router: Router, private authService: AuthService){}


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

  getUserId(): number {
    const userId = localStorage.getItem('logged_userId');
    return Number(userId);
  }

  navigateToProfile(): void {
    const id = this.getUserId();
      this.router.navigate(['/user/profile', id]);
  }

  logout(): void {
    this.authService.logout();
    if(localStorage.getItem('isUserLoggedIn') == "false"){
      alert("Logged out successfully.");
    }
  }

  navigateToCartPage() {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['cart']);
    }
    else {
      const id = this.getUserId();
      this.router.navigate(['cart',id]);
    }
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
