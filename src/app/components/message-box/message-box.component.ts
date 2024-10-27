import { Component } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css'
})
export class MessageBoxComponent {

  message: string | null = null;

  constructor(private messageService: MessageService){}

  ngOnInit(){
    // this.message = "testing the message service";
    this.messageService.message$.subscribe(message => {
      this.message = message;
    })
  }

}
