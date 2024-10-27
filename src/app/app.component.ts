import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MessageBoxComponent } from "./components/message-box/message-box.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, FontAwesomeModule, FormsModule, NavigationBarComponent, FooterComponent, MessageBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'book-store-front-end';
}
