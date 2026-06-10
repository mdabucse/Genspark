import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Product {
  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http
      .get<any>('https://dummyjson.com/products')
      .pipe(
        map(response => response.products),
        catchError(error => {
          console.error('Product service getProducts error', error);
          return throwError(() => error);
        })
      );
  }

  getProduct(id: number) {
    return this.http.get<any>(`https://dummyjson.com/products/${id}`).pipe(
      catchError(error => {
        console.error('Product service getProduct error', error);
        return throwError(() => error);
      })
    );
  }
}
