import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductModel } from '../models/product.model';
import { ProductApiService } from '../services/product.api.service';

@Component({
  selector: 'app-products',
  imports: [DecimalPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products = signal<ProductModel[]>([]);

  fuzzyWeights = {
    price: 0.4,
    rating: 0.4,
    discount: 0.2,
  };

  constructor(private productApiService: ProductApiService) {
    this.productApiService.getProductsFromDummyJson()
      .subscribe({
        next: (response: any) => {
          this.products.set(response.products);
          this.sortProductsByFuzzyScore();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  calculateCheapScore(product: ProductModel): number {
    return product.price <= 500 ? 1 :
      product.price <= 1000 ? 0.8 :
      product.price <= 2000 ? 0.5 : 0.2;
  }

  calculateRatingScore(product: ProductModel): number {
    const rawScore = product.rating / 5;
    return Math.min(Math.max(rawScore, 0), 1);
  }

  calculateDiscountScore(product: ProductModel): number {
    const rawScore = product.discountPercentage / 30;
    return Math.min(Math.max(rawScore, 0), 1);
  }

  calculateFuzzyScore(product: ProductModel): number {
    const cheapScore = this.calculateCheapScore(product);
    const ratingScore = this.calculateRatingScore(product);
    const discountScore = this.calculateDiscountScore(product);

    return (
      cheapScore * this.fuzzyWeights.price +
      ratingScore * this.fuzzyWeights.rating +
      discountScore * this.fuzzyWeights.discount
    );
  }

  sortProductsByFuzzyScore(): void {
    const sorted = [...this.products()].sort((a, b) => {
      return this.calculateFuzzyScore(b) - this.calculateFuzzyScore(a);
    });
    this.products.set(sorted);
  }

  handleChangeClick(): void {
    this.sortProductsByFuzzyScore();
  }
}
