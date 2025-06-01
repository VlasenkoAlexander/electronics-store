import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/users/me/wishlist`;
  private wishlistItems: Product[] = [];
  private wishlistSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  getWishlist(): Observable<Product[]> {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(productId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${productId}`, null)
      .pipe(tap(() => this.loadWishlist()));
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`)
      .pipe(tap(() => this.loadWishlist()));
  }

  private loadWishlist(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe(items => {
      this.wishlistItems = items;
      this.wishlistSubject.next(items);
    });
  }
}
