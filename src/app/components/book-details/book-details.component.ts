import { Component, Input } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../book-list/book';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BestSellersComponent } from "../best-sellers/best-sellers.component";
import { CommonService } from '../../common/common';
import { CartItem, CartService } from '../../services/cart.service';
import { RatingsComponent } from "../ratings/ratings.component";

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, BestSellersComponent, RatingsComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
  providers: [BookService]
})
export class BookDetailsComponent {

  bookDetails: Book | undefined;
  quantity: number = 1;

  constructor(private bookService: BookService, private route: ActivatedRoute, private commonService: CommonService,
    private cartService: CartService
  ) {}

  ngOnInit(){
    // const isbn = this.route.snapshot.paramMap.get('isbn')!;
    const id = this.route.snapshot.paramMap.get('id');
    if(id)
    {
      this.bookService.getBookById(id).subscribe(
        (book: Book) => {
          this.bookDetails = book;
          this.bookDetails.sanitizedImageData = this.commonService.sanitizeImageData(this.bookDetails.imageData);
        },
        (error) => {
          this.bookDetails = undefined;
        }
      )
    }
      // this.bookDetails$ = this.bookService.getBookById(id);
  }

  addQuantity(){
    this.quantity ++;
  }

  decrementQuantity(){
    if(this.quantity > 1)
        this.quantity --;
  }

  addBookToCart(book: Book) {
    const cartItem: CartItem = {
      bookId: book.id as number,
      quantity: this.quantity,
      price: book.price,
      totalPrice: book.price * this.quantity,
      title: book.title
    }
    // this.cartService.addToCart(cartItem);
    this.cartService.addToCart(cartItem).subscribe(
      () => console.log('Item added to cart successfully'),
      error => console.error('Error adding item to cart', error)
    );
  }

}
