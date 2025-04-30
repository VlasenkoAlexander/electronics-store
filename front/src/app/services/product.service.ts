import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(search?: string): Observable<Product[]> {
    const url = search && search.trim()
      ? `${this.apiUrl}?search=${encodeURIComponent(search.trim())}`
      : this.apiUrl;
    console.log('Запрос продуктов по URL:', url);
    return this.http.get<Product[]>(url).pipe(
      tap(data => console.log('Получены продукты:', data)),
      catchError(error => this.handleError(error))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ошибка при запросе продуктов:', error);
    let errorMessage = 'Произошла ошибка при загрузке товаров';
    if (error.error instanceof ErrorEvent) {
      // Ошибка на стороне клиента
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      // Ошибка на стороне сервера
      errorMessage = `Код ошибки: ${error.status}\nСообщение: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}