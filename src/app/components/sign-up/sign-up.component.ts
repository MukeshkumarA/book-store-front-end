import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../services/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {

  confirmPassword:string = "";
  signupData: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'MEMBER',
    address: '',
    phoneNumber: ''
  };

  constructor(private dialogRef: MatDialogRef<SignUpComponent>, private router: Router) { }

  // onSubmit() {
    // this.authService.signup(this.signupData).subscribe(response => {
    //   console.log('User registered successfully:', response);
    //   // Handle success response (e.g., navigate to login page, show success message, etc.)
    // }, error => {
    //   console.error('Registration error:', error);
    //   // Handle error response (e.g., show error message)
    // });
  // }

  onSubmit(signupForm: NgForm){
    this.router.navigate(['/']);
  }

  ClosePopup(): void {
    this.dialogRef.close();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    const isControlKey = allowedKeys.includes(event.key) || event.key.startsWith('Arrow') || event.key === 'Backspace';

    if (!isControlKey && (event.key < '0' || event.key > '9')) {
      event.preventDefault();
    }
  }

}
