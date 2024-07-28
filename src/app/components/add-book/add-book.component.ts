import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Book } from '../book-list/book';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { response } from 'express';
import { error } from 'console';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {
  imagePreview: string | ArrayBuffer | null = null;
  bookData: Book = {
    title: '',
    author: '',
    publicationDate: '',
    isbn: '',
    genre: '',
    price: 0,
    description: '',
    language: '',
    stockQuantity: 0,
    publisher: undefined,
    pageCount: 0,
    format: undefined,
    dimensions: undefined,
    imageData: undefined, // Changed to null
  };

  constructor(private bookService: BookService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
          const formData = new FormData();
    formData.append('title', this.bookData.title);
    formData.append('author', this.bookData.author);
    formData.append('publisher', this.bookData.publisher || '');
    formData.append('publicationDate', this.bookData.publicationDate);
    formData.append('isbn', this.bookData.isbn);
    formData.append('genre', this.bookData.genre);
    formData.append('price', this.bookData.price.toString());
    formData.append('description', this.bookData.description);
    formData.append('pageCount', (this.bookData.pageCount || 0).toString());
    formData.append('language', this.bookData.language);
    formData.append('stockQuantity', this.bookData.stockQuantity.toString());
    formData.append('rating', (this.bookData.rating || 0).toString());
    formData.append('format', this.bookData.format || '');
    formData.append('dimensions', this.bookData.dimensions || '');

    if (this.bookData.imageData) {
      formData.append('imageData', this.bookData.imageData);
    }

    console.log(this.bookData);
    const token = localStorage.getItem('access_token');
      // Send JSON payload with Base64 encoded image
      if(token)
      {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.bookService.addBook(this.bookData, headers).subscribe(response => {
          console.log("Book added successfully:", response);
          form.resetForm();
          this.imagePreview = null;
          this.bookData.imageData = undefined; // Clear the imageData after submission
        }, error => {
          console.error('Error adding book:', error);
        });
      }
      else{
        console.log("Token not found");
      }
  }
}


  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.bookData.imageData = reader.result as string; // Base64 encoded string
        this.imagePreview = reader.result; // Preview image
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  }

}


// working
// onSubmit(form: NgForm) {
//   if (form.valid) {
//     const formData = new FormData();
//     formData.append('title', this.bookData.title);
//     formData.append('author', this.bookData.author);
//     formData.append('publisher', this.bookData.publisher || '');
//     formData.append('publicationDate', this.bookData.publicationDate);
//     formData.append('isbn', this.bookData.isbn);
//     formData.append('genre', this.bookData.genre);
//     formData.append('price', this.bookData.price.toString());
//     formData.append('description', this.bookData.description);
//     formData.append('pageCount', (this.bookData.pageCount || 0).toString());
//     formData.append('language', this.bookData.language);
//     formData.append('stockQuantity', this.bookData.stockQuantity.toString());
//     formData.append('rating', (this.bookData.rating || 0).toString());
//     formData.append('format', this.bookData.format || '');
//     formData.append('dimensions', this.bookData.dimensions || '');

//     if (this.bookData.imageData) {
//       formData.append('imageData', this.bookData.imageData);
//     }

//     this.bookService.addBook(formData).subscribe(response => {
//       console.log("Book added successfully:", response);
//       form.resetForm();
//       this.imagePreview = null;
//     }, error => {
//       console.error('Error adding book:', error);
//     });
//   }
// }

// onImageSelected(event: Event) {
//   const file = (event.target as HTMLInputElement).files![0];
//   if (file) {
//     this.bookData.imageData = file;

//     const reader = new FileReader();
//     reader.onload = () => {
//       this.imagePreview = reader.result;
//     };
//     reader.readAsDataURL(file);
//   }
// }





  // onSubmit(form: NgForm){
  //   if (form.valid) {
  //     const formData = new FormData();
  //     formData.append('title', this.bookData.title);
  //     formData.append('author', this.bookData.author);
  //     formData.append('publicationDate', this.bookData.publicationDate);
  //     formData.append('isbn', this.bookData.isbn);
  //     formData.append('genre', this.bookData.genre);
  //     formData.append('price', this.bookData.price.toString());
  //     formData.append('description', this.bookData.description);
  //     formData.append('language', this.bookData.language);
  //     if (this.bookData.coverImage) {
  //       formData.append('coverImage', this.bookData.coverImage);
  //     }
  //     formData.append('stockQuantity', this.bookData.stockQuantity.toString());
  //     formData.append('stockQuantity', this.bookData.stockQuantity.toString());
  //     formData.append('publisher', this.bookData.publisher || '');
  //     if (this.bookData.pageCount !== undefined && this.bookData.pageCount !== null) {
  //       formData.append('pageCount', this.bookData.pageCount.toString());
  //     }
  //     formData.append('format', this.bookData.format || '');
  //     formData.append('dimensions', this.bookData.dimensions || '');

  //     console.log(formData);
  //     console.log(this.bookData.coverImage);


  //     this.bookService.addBook(formData).subscribe(response => {
  //       console.log("Book added successfully, response");
  //       form.resetForm();
  //       this.imagePreview = null;
  //     }, error => {
  //       console.error('Error adding book:', error);
  //     })
      

  //     // this.http.post('http://localhost:8080/bookstore/api/v1/books', formData)
  //     //   .subscribe(response => {
  //     //     console.log('Book added successfully:', response);
  //     //     form.resetForm();
  //     //     this.imagePreview = null;
  //     //   }, error => {
  //     //     console.error('Error adding book:', error);
  //     //   });
    
  //   }
  // }


  // onSubmit(form: NgForm) {
  //   if (form.valid) {
  //       const formData = new FormData();
  //       formData.append('title', this.bookData.title);
  //       formData.append('author', this.bookData.author);
  //       formData.append('publisher', this.bookData.publisher || '');
  //       formData.append('publicationDate', this.bookData.publicationDate);
  //       formData.append('isbn', this.bookData.isbn);
  //       formData.append('genre', this.bookData.genre);
  //       formData.append('price', this.bookData.price.toString());
  //       formData.append('description', this.bookData.description);
  //       formData.append('pageCount', (this.bookData.pageCount || 0).toString());
  //       formData.append('language', this.bookData.language);
  //       formData.append('stockQuantity', this.bookData.stockQuantity.toString());
  //       formData.append('rating', (this.bookData.rating || 0).toString());
  //       formData.append('format', this.bookData.format || '');
  //       formData.append('dimensions', this.bookData.dimensions || '');

  //       if (this.bookData.image) {
  //           formData.append('coverImage', this.bookData.image);
  //       }

  //       this.bookService.addBook(formData).subscribe(response => {
  //           console.log("Book added successfully:", response);
  //           form.resetForm();
  //           this.imagePreview = null;
  //       }, error => {
  //           console.error('Error adding book:', error);
  //       });
  //   }
  // }

  // onImageSelected(event: Event){
  //     const file = (event.target as HTMLInputElement).files![0];
  //     if(file) {
  //       this.bookData.image = file;

  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.imagePreview = reader.result;
  //       };
  //       reader.readAsDataURL(file);
  //     }
  // }
