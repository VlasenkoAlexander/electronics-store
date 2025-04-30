import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}/reviews`)
      .pipe(catchError(this.handleError));
  }

  addReview(productId: number, review: { rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${productId}/reviews`, review)
      .pipe(catchError(this.handleError));
  }

  /** Update an existing review */
  updateReview(productId: number, reviewId: number, review: { rating: number; comment: string }): Observable<Review> {
    return this.http.put<Review>(
      `${this.apiUrl}/${productId}/reviews/${reviewId}`, review
    ).pipe(catchError(this.handleError));
  }

  /** Delete a review */
  deleteReview(productId: number, reviewId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${productId}/reviews/${reviewId}`
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Review service error', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
