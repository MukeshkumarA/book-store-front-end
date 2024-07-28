import { Component } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user!: User;
  isEditing: boolean = false;
  userId!: number;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = userId;
    if(this.userId)
    {
      this.userService.getUserProfile(userId).subscribe(
        (user: User) => {
          this.user = user;
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    }
    else{
      console.log("User id is undefined");
    }
  }

  editProfile(): void {
    this.isEditing = true;
  }

  saveProfile(): void {
    this.userService.updateUserProfile(this.userId!, this.user).subscribe(
      (updatedUser: User) => {
        this.user = updatedUser;
        this.isEditing = false;
      },
      (error) => {
        console.error('Error updating user profile:', error);
      }
    );
  }
}
