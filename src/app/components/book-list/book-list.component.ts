import { Component, NgModule, OnInit } from '@angular/core';
import { Book } from './book';
import { ApiService } from '../../services/api-service';
import { map } from 'rxjs';
import { toTitleCase } from '../../utility/utility';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { RatingsComponent } from '../ratings/ratings.component';
import { SearchBooksComponent } from "../search-books/search-books.component";
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from '../../common/common';
import { CartItem, CartService } from '../../services/cart.service';
import { BookCardComponent } from "../book-card/book-card.component";


@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RatingsComponent, SearchBooksComponent, BookCardComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
  providers: [BookService]
})
export class BookListComponent {

  books: Book[] = [];
  paginatedBooks: Book[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private bookService: BookService, private router: Router, private sanitizer: DomSanitizer, private commonService: CommonService,
    private cartService: CartService
  ) {
    this.loadBooks();
  }

  // ngOnInit() {
  //   this.loadBooks();
  // }

  loadBooks() {
    this.bookService.getAllBooks().subscribe(
      (books: Book[]) => {
        this.books = books.map(book => ({
          ...book,
          sanitizedImageData: this.commonService.sanitizeImageData(book.imageData)
        }));
        this.totalItems = books.length;
        this.paginateBooks();
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }
  
  // sanitizeData(base64String: string | undefined): SafeUrl{
  //   // const base64String = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOoAAADYCAMAAADS+I/aAAABr...';
  //   if(base64String)
  //       return this.sanitizer.bypassSecurityTrustUrl(base64String);

  //   return undefined;
  // }

  navigateToBookDetails(id: number|undefined) {
    if(id)
      this.router.navigate(['/book', id]);
  }

  paginateBooks(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedBooks = this.books.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginateBooks();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  searchByTitle(title: string): void {
    this.books = this.bookService.findBookByName(title);
    this.totalItems = this.books.length;
    this.currentPage = 1;
    this.paginateBooks();
  }

  searchByAuthor(author: string): void {
    this.books = this.bookService.findBookByAuthor(author);
    this.totalItems = this.books.length;
    this.currentPage = 1;
    this.paginateBooks();
  }

  // addBookToCart(book: Book){
  //   const cartItem: CartItem = {
  //     bookId: book.id as number,
  //     quantity: 1,
  //     price: book.price,
  //     totalPrice: book.price,
  //     title: book.title
  //   }
  //   this.cartService.addToCart(cartItem);
  // }

  addBookToCart(book: Book) {
    const cartItem: CartItem = {
      bookId: book.id as number,
      quantity: 1,
      price: book.price,
      totalPrice: book.price * 1,
      title: book.title
    }
    // this.cartService.addToCart(cartItem);
    this.cartService.addToCart(cartItem).subscribe(
      () => console.log('Item added to cart successfully'),
      error => console.error('Error adding item to cart', error)
    );
  }
  

}
