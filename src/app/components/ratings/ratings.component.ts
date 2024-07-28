import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.css'
})
export class RatingsComponent {
  
  @Input() rating: number = 0;

  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0);
  }

  get partialStarWidth(): number {
    return (this.rating % 1) * 100;
  }

  get emptyStars(): number[] {
    return Array(5 - Math.ceil(this.rating)).fill(0);
  }

}
