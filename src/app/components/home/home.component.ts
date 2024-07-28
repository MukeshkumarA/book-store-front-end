import { Component } from '@angular/core';
import { BookListComponent } from "../book-list/book-list.component";
import { NavigationBarComponent } from "../navigation-bar/navigation-bar.component";
import { BookCategoriesComponent } from "../book-categories/book-categories.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookListComponent, NavigationBarComponent, BookCategoriesComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}
