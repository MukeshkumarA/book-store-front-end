import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../book-list/book';
import { CommonModule } from '@angular/common';
import { RatingsComponent } from "../ratings/ratings.component";

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RatingsComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {

  @Input()
  book!: Book;

  @Output()
  navigatBook = new EventEmitter<number>();

  @Output()
  addToCart = new EventEmitter<Book>();

  constructor(){
    
  }


  navigateToBookDetails(bookId: number | undefined) {
    if(bookId)
      this.navigatBook.emit(bookId);
  }


  addBookToCart(book: Book) {
    this.addToCart.emit(book);
  }

}
