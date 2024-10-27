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
import { error } from 'node:console';
import { MessageService } from '../../services/message.service';

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
    private dialog: MatDialog,
    private messageSerive: MessageService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        // Load server cart for logged-in users
        this.loadServerCart();
      }
       else {
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

  // private loadServerCart(): void {
  //   this.cartService.getCart().subscribe(cart => {
  //     // this.cart = cart;
  //     // this.cart.totalPrice = this.calculateTotalPrice(cart.cartItems);
  //     // this.fetchBookDetailsForCart(cart.cartItems);
  //     console.log(cart);
  //   });
  // }

  private loadServerCart(): void {
    this.cartService.getCart().subscribe(cart => {
      // Store the cart data in the component
      this.cart = cart;
      console.log(cart);
      
      // Optionally calculate the total price (if needed)
      this.cart.totalPrice = this.calculateTotalPrice(cart.cartItems);
      
      // Fetch additional details for cart items (if needed)
      this.fetchBookDetailsForCart(cart.cartItems);
      
      // Log the cart for debugging
      console.log(cart);
    }, error => {
      // Handle any error
      this.messageSerive.showMessage("Error fetching cart");
      console.error('Error fetching cart:', error);
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
          this.loadServerCart();
        });
      });
      this.cartService.clearSessionCart();
    }
    this.calculateTotalPrice(this.cart.cartItems);
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
        }, 1000);
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
      // alert(item.quantity);
  
      this.debounceIncrementTimer = setTimeout(() => {
        this.cartService.updateCartItem(updatedItem).subscribe(
          () => {
            // alert("quantity updated");
            console.log("Quantity updated");
          },
          error => {
            console.log("Error while updating quantity", error);
          }
        );
      }, 1000);
    } else {
      this.cartService.storeItemInSessionCart(item);
    }
  }

  removeCartItem(cartItem: CartItem) {
    this.cart.cartItems = this.cart.cartItems.filter(c => c.bookId != cartItem.bookId);
    if (!this.isLoggedIn) {
      if(this.cartService.removeFromSessionCart(cartItem))
          this.messageSerive.showMessage("Item removed successfully");
      this.cart.totalPrice = this.calculateTotalPrice(this.cart.cartItems);
      // this.cart.totalPrice = this.calculateTotalPrice(this.cartService.getSessionCart().forEach(cart));
    }
    else {
      this.cartService.removeFromCart(cartItem.bookId).subscribe(
        () => {
          this.messageSerive.showMessage("Item remved succcessfully");
        },
        (error)=>{
          this.messageSerive.showMessage("Not able to remove items");
          console.log("Error while removing items", error);
        }
      );
      
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
      if(this.cartService.clearSessionCart())
      {
        this.messageSerive.showMessage("Your cart is cleared!")
        this.cart = { cartItems: [], totalPrice: 0 };
      }
    } else {
      this.cartService.clearCart().subscribe(
        () => {
          this.cart = { cartItems: [], totalPrice: 0 };
          this.messageSerive.showMessage("Your cart is cleared");
        },
        error => {
          this.messageSerive.showMessage("Failed to clear cart");
          console.error('Failed to clear cart', error);
        }
      );
    }
  }

  // goToCategories() {
  //   this.route.
  // }

}
