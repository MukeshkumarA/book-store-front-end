import { SafeUrl } from "@angular/platform-browser";

export interface Book {
    id?: number;
    title: string;
    author: string;
    publisher?: string;
    publicationDate: string;
    isbn: string;
    genre: string;
    price: number;
    description: string;
    pageCount?: number;
    language: string;
    imageData: string | undefined;
    stockQuantity: number;
    rating?: number;
    format?: string;
    dimensions?: string;
    sanitizedImageData?: SafeUrl
  }

  