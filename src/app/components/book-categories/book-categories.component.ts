import { Component, ElementRef, ViewChild } from '@angular/core';
import { Book } from '../book-list/book';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common';
import { BookCardComponent } from "../book-card/book-card.component";
import { CartItem, CartService } from '../../services/cart.service';
import { error } from 'console';
import { UserNotLoggedInError } from '../../userNotLoggedInError';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-book-categories',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  templateUrl: './book-categories.component.html',
  styleUrl: './book-categories.component.css',
})
export class BookCategoriesComponent {

  books: Book[] = [];
  booksGenre = new Map<string, Book[]>();
  bookGenres: string[] = [];


  constructor(private bookService: BookService, private router: Router, private commonService: CommonService, private cartService: CartService,
    private messageService: MessageService
  ) { }

  @ViewChild('books') booksContainer!: ElementRef;

  ngOnInit() {
    this.bookService.getAllBooks().subscribe(
      (books: Book[]) => {
        this.books = books.map(book => ({
          ...book,
          sanitizedImageData: this.commonService.sanitizeImageData(book.imageData)
        }));;
        this.mapBooksWithGenre(this.books);
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  mapBooksWithGenre(books: Book[]) {
    books.forEach(book => {
      if (this.booksGenre.has(book.genre.toLowerCase())) {
        const genreBooks = this.booksGenre.get(book.genre.toLowerCase());
        genreBooks?.push(book);
      }
      else {
        this.booksGenre.set(book.genre.toLowerCase(), [book]);
      }
    });

    this.bookGenres = Array.from(this.booksGenre.keys());
  }

  navigateToBookDetails(id: number) {
    if (id)
      this.router.navigate(['/book', id]);
  }

  addBookToCart(book: Book) {
    const cartItem: CartItem = {
      bookId: book.id as number,
      quantity: 1,
      price: book.price,
      totalPrice: book.price,
      title: book.title
    }
    this.cartService.addToCart(cartItem).subscribe(
      () => this.messageService.showMessage('Item added to cart'),
      error => {
        if (error instanceof UserNotLoggedInError) {
          this.messageService.showMessage('Item added to cart');
          console.log("User not logged in");
        }
        console.log('Error adding item to cart', error)
      });
  }


  scrollLeft(container: HTMLElement) {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement) {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }


}
