import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-search-books',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-books.component.html',
  styleUrl: './search-books.component.css'
})
export class SearchBooksComponent {
  @Output() searchByTitle = new EventEmitter<string>();
  @Output() searchByAuthor = new EventEmitter<string>();

  searchedText: string = "";
  faSearch = faSearch;

  onSearchByTitle() {
    this.searchByTitle.emit(this.searchedText);

  }

  onSearchByAuthor() {
    this.searchByAuthor.emit(this.searchedText);
  }

}
