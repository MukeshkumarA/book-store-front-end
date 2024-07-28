import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../book-list/book';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.css'
})
export class BestSellersComponent {

  @Input()
  currentBook!: Book;

  books: Book[] = [];
  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;
  private routeSub: Subscription = new Subscription();

  @ViewChild('slider', { static: true }) slider!: ElementRef;

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getPopularBooks();
    if(this.currentBook)
        this.books = this.books.filter(b => b.id != this.currentBook.id);
    this.routeSub = this.route.params.subscribe(params => {
      const bookId = +params['bookId']; // Extract the bookId from the route parameters
      if (bookId) {
        this.loadBookDetails(bookId);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe(); // Clean up the subscription to avoid memory leaks
  }

  getPopularBooks() {
    this.bookService.getAllBooks().subscribe(
      (books: Book[]) => {
        this.books = books;
        this.books = this.books.filter(book => (book.rating && book?.rating > 3.5));
        this.cdr.detectChanges(); // Ensure the view updates with the new data
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  loadBookDetails(bookId: number) {
    console.log('Loading details for book ID:', bookId);
    // Implement logic to load book details based on the bookId
    // For example, you can filter the books array or fetch book details from the service
  }

  scrollLeft() {
    this.slider.nativeElement.scrollBy({ left: -500, behavior: 'smooth' });
    this.updateButtonStates();
  }

  scrollRight() {
    this.slider.nativeElement.scrollBy({ left: 500, behavior: 'smooth' });
    this.updateButtonStates();
  }

  updateButtonStates() {
    const sliderElement = this.slider.nativeElement;
    const scrollLeft = sliderElement.scrollLeft;
    const scrollWidth = sliderElement.scrollWidth;
    const clientWidth = sliderElement.clientWidth;
    this.isPrevDisabled = scrollLeft === 0;
    this.isNextDisabled = scrollLeft + clientWidth >= (scrollWidth - 100);
  }

  goToBookDetails(bookId: number | undefined) {
    console.log('Book ID:', bookId);
    if(bookId)
      this.router.navigate(['/book', bookId]);
  }
  
 
}
