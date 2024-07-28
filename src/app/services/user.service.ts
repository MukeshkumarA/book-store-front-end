import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  address: string;
  phoneNumber: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  getUserProfile(userId: number): Observable<User> {
    return this.apiService.getUserProfile(userId);
  }

  updateUserProfile(userId: number, user: User): Observable<User> {
    return this.apiService.updateUserProfile(userId, user);
  }
}
