import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductRating } from '../models/product-rating.model';

@Injectable({ providedIn: 'root' })
export class ProductRatingService {
  private apiUrl = `${environment.apiUrl}/admin/product-ratings`;

  constructor(private http: HttpClient) {}

  getRatings(from: string, to: string): Observable<ProductRating[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<ProductRating[]>(this.apiUrl, { params });
  }
}
