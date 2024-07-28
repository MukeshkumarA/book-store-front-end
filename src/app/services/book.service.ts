import { Injectable } from "@angular/core";
import { ApiService } from "./api-service";
import { toTitleCase } from "../utility/utility";
import { catchError, map, Observable, throwError } from "rxjs";
import { Book } from "../components/book-list/book";
import { NgForm } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn:'root'
})
export class BookService {
    books:Book[] = [];

    constructor(private apiService: ApiService){
        this.getAllBooks();
    }

    getAllBooks(): Observable<Book[]> {
        return this.apiService.getAllBooks().pipe(
          map((books: Book[]) => {
            return books.map(book => {
              book.title = toTitleCase(book.title);
              book.author = toTitleCase(book.author);
              this.books.push(book);
              return book;
            });
          }),
          catchError(error => {
            console.error('Error fetching books:', error);
            return throwError(error); // Rethrow the error or handle it as needed
          })
        );
      }


      findBookByName(name: string): Book[]{
        name = name.toLowerCase();
        return this.books.filter(book => book.title.toLowerCase().includes(name));
      }

      findBookByAuthor(authorName: string): Book[] {
        authorName = authorName.toLowerCase();
        return this.books.filter(book => book.author.toLowerCase().includes(authorName));
      }

      getBookByIsbn(isbn: string): Observable<Book> {
        return this.apiService.getBookByIsbn(isbn);
      }

      getBookById(id: string): Observable<Book> {
        return this.apiService.getBookById(id);
      }

      getPopularBooks(): Observable<Book[]> {
        return this.apiService.getPopularBooks();
      }

      addBook(book: Book, headers: HttpHeaders) : Observable<Book>{
        return this.apiService.addBook(book, headers);
      }

}