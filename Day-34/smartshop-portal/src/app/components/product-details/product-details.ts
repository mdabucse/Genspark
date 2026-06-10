import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../services/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetails implements OnInit {
  product = signal<any>(null);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private productService: Product,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        this.errorMessage.set('Product ID is invalid.');
        return;
      }

      this.productService.getProduct(id).subscribe({
        next: data => {
          this.product.set(data);
        },
        error: err => {
          console.error('Product detail load failed', err);
          this.errorMessage.set('Unable to load product details.');
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
