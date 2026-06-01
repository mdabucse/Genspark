import { Component } from '@angular/core';
import { Product } from '../models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  product: Product = {
    title: 'iPhone 15',
    price: 79999,
    description: 'Latest Apple smartphone with advanced features and excellent camera.',
    thumbnail: 'https://dummyjson.com/image/i/products/1/thumbnail.jpg'
  };

}