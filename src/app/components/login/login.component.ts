import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';


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
  providers: [AuthService]

})
export class LoginComponent {

  

  loginData: LoginData = {
    email: '',
    password: '',
  };

  constructor(private dialogRef: MatDialogRef<LoginComponent>, private authService: AuthService) { }

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
        alert("login success");
        // Handle successful login (e.g., redirect to another page)
      }, error => {
        console.error('Login error:', error);
        // Handle error response (e.g., show error message)
      });
    } else {
      console.log('Form is invalid');
    }
  }

  ClosePopup(): void {
    this.dialogRef.close();
  }

}
