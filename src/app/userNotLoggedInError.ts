import { AppError } from "./error";

export class UserNotLoggedInError extends AppError {
    constructor() {
      super("User is not logged in");
    }
  
    handle(): void {
      console.error(`${this.name}: ${this.message}`);
    }
  }
  