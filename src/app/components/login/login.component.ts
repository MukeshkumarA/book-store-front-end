import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Route, Router } from '@angular/router';
import { MessageService } from '../../services/message.service';


export interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {

  
  loginData: LoginData = {
    email: '',
    password: '',
  };

  constructor(private dialogRef: MatDialogRef<LoginComponent>, private authService: AuthService,
    private router: Router, private cdr: ChangeDetectorRef, private messageService: MessageService
  ) { }

  // onSubmit(form: NgForm) {
    // console.log(form.value);
    // alert("submit");
    // this.authService.signup(this.signupData).subscribe(response => {
    //   console.log('User registered successfully:', response);
    //   // Handle success response (e.g., navigate to login page, show success message, etc.)
    // }, error => {
    //   console.error('Registration error:', error);
    //   // Handle error response (e.g., show error message)
    // });
  // }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Submitted!', form.value);
      this.authService.login(form.value.email, form.value.password).subscribe(response => {
        console.log('Login successful:', response);
        const userName = response.firstName || "User";
        this.messageService.showMessage(`Login successful! Welcome back ${userName}`);
        // alert("login success");
        this.dialogRef.close();
        this.cdr.detectChanges(); 
        this.router.navigate(['/']);
        // this.router.navigate(['/']);
      }, error => {
        console.error('Login error:', error);
        this.messageService.showMessage("Login failed. Please check your email and password and try again.");
      });
    } else {
      console.log('Form is invalid');
    }
  }

  ClosePopup(): void {
    this.dialogRef.close();
  }

}
