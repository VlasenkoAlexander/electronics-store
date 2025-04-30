import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/users/me/wishlist`;

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addToWishlist(productId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${productId}`, null);
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
}
