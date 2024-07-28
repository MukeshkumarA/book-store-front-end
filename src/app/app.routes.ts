import { Routes } from '@angular/router';
import { BookCategoriesComponent } from './components/book-categories/book-categories.component';
import { HomeComponent } from './components/home/home.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartComponent } from './components/cart/cart.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './services/auth-gruard.service';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'categories', component: BookCategoriesComponent },
    { path: 'book/:id', component: BookDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'categories', component: BookCategoriesComponent },
    { path: 'admin/addbook', component: AddBookComponent },
    { path: 'user/profile/:id', component: UserProfileComponent },
    { path: 'cart', component: CartComponent },
    { path: 'cart/:id', component: CartComponent },

];
