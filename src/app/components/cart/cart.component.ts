import { Component } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from './cart-mode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { forkJoin } from 'rxjs';
import { PopupService } from '../../services/popup.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {


  cart: Cart = { cartItems: [], totalPrice: 0 };
  private isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private bookService: BookService,
    private popupService: PopupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        // Load server cart for logged-in users
        this.loadServerCart();
      } else {
        // Load session cart for non-logged-in users
        this.loadSessionCart();
      }
    });

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.syncSessionCartWithServer();
      }
    });
  }

  private loadSessionCart(): void {
    const sessionCart = this.cartService.getSessionCart();
    // this.cart.cartItems = sessionCart;
    // this.cart.totalPrice = this.calculateTotalPrice(sessionCart);
    console.log(sessionCart);
    this.fetchBookDetailsForCart(sessionCart);
  }

  private loadServerCart(): void {
    this.cartService.getCart().subscribe(cart => {
      // this.cart = cart;
      // this.cart.totalPrice = this.calculateTotalPrice(cart.cartItems);
      this.fetchBookDetailsForCart(cart.cartItems);
    });
  }

  private fetchBookDetailsForCart(cartItems: CartItem[]): void {
    const bookDetailsRequests = cartItems.map(item =>
      this.bookService.getBookById(item.bookId.toString())
    );

    forkJoin(bookDetailsRequests).subscribe(books => {
      this.cart.cartItems = cartItems.map((item, index) => ({
        ...item,
        book: books[index] // Merge book details into cart item for display
      }));
      this.cart.totalPrice = this.calculateTotalPrice(this.cart.cartItems);
    });
  }

  syncSessionCartWithServer(): void {
    if (this.isLoggedIn) {
      const sessionCart = this.cartService.getSessionCart();
      sessionCart.forEach(item => {
        this.cartService.addToCart(item).subscribe(() => {
          this.cartService.clearSessionCart();
          this.loadServerCart();
        });
      });
    }
  }

  private calculateTotalPrice(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  }

  debounceIncrementTimer: any;
  debounceDecrementTimer: any;

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = item.quantity * item.price;
      this.cart.totalPrice = this.calculateTotalPrice(this.cart.cartItems);
  
      if (this.isLoggedIn) {
        clearTimeout(this.debounceDecrementTimer);
        
        // Creating a copy of the current item state
        const updatedItem = { ...item };
  
        this.debounceDecrementTimer = setTimeout(() => {
          this.cartService.updateCartItem(updatedItem).subscribe();
        }, 2000);
      } else {
        this.cartService.storeItemInSessionCart(item);
      }
    }
  }
  
  incrementQuantity(item: CartItem) {
    item.quantity++;
    item.totalPrice = item.quantity * item.price;
    this.cart.totalPrice = this.calculateTotalPrice(this.cart.cartItems);
  
    if (this.isLoggedIn) {
      // debouncing 
      clearTimeout(this.debounceIncrementTimer);
  
      // Creating a copy of the current item state
      const updatedItem = { ...item };
      alert(item.quantity);
  
      this.debounceIncrementTimer = setTimeout(() => {
        this.cartService.updateCartItem(updatedItem).subscribe();
      }, 2000);
    } else {
      this.cartService.storeItemInSessionCart(item);
    }
  }

  removeCartItem(cartItem: CartItem) {
    this.cart.cartItems = this.cart.cartItems.filter(c => c.bookId != cartItem.bookId);
    if (!this.isLoggedIn) {
      this.cartService.removeFromSessionCart(cartItem);
    }
    else {
      this.cartService.removeFromCart(cartItem.bookId);
    }
  }

  openClearCartPopup(): void {
    this.popupService.openPopup('Are you sure you want to delete the cart?', () => this.clearCart(), () => { });
  }

  // handleProceedToCheckout() {
  //   this.cartService.checkoutCart().subscribe(response => {
  //     // Handle successful checkout
  //     alert("Checkout successful!");
  //     this.cart = { cartItems: [], totalPrice: 0 };
  //   }, error => {
  //     // Handle checkout failure
  //     alert("Checkout failed. Please try again.");
  //   });
  // }

  handleProceedToCheckout() {
    alert("Functionality is not implemented yet")
  }


  clearCart() {
    if (!this.isLoggedIn) {
      this.cartService.clearSessionCart();
      this.cart = { cartItems: [], totalPrice: 0 };
      alert("Your cart is cleared!");
    } else {
      this.cartService.clearCart().subscribe(
        () => {
          this.cart = { cartItems: [], totalPrice: 0 };
          alert("Your cart is cleared!");
        },
        error => {
          console.error('Failed to clear cart', error);
          alert('Failed to clear cart');
        }
      );
    }
  }

  // goToCategories() {
  //   this.route.
  // }

}
