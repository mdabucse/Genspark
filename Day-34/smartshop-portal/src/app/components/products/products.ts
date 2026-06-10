import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {

  products = signal<any[]>([]);
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private productService: Product,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.productService
      .getProducts()
      .subscribe({
        next: data => {
          this.products.set(data);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Products load failed', err);
          this.errorMessage.set('Unable to load products. Check the console for details.');
          this.isLoading.set(false);
        }
      });
  }

  viewDetails(id: number) {
    this.router.navigate(['/products', id]);
  }

}
