import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSource = new BehaviorSubject<string | null>(null);
  public message$ = this.messageSource.asObservable();


  showMessage(message: string)
  {
    this.messageSource.next(message);

    // clear message after 3 seconds
    setTimeout(() => {
      this.clearMessage();
    }, 1000);
  }


  clearMessage() {
    this.messageSource.next(null);
  }

}
