import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Customers } from './customers/customers';
import { ProductCardComponent } from './product-card/product-card';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [Customers, ProductCardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Basics');
}
