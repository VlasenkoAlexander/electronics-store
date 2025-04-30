import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoyaltyLevel } from '../models/loyalty-level.model';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  private apiUrl = `${environment.apiUrl}/loyalty-levels`;

  constructor(private http: HttpClient) {}

  getAllLevels(): Observable<LoyaltyLevel[]> {
    return this.http.get<LoyaltyLevel[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  createLevel(level: LoyaltyLevel): Observable<LoyaltyLevel> {
    return this.http.post<LoyaltyLevel>(this.apiUrl, level).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  updateLevel(id: number, level: LoyaltyLevel): Observable<LoyaltyLevel> {
    return this.http.put<LoyaltyLevel>(`${this.apiUrl}/${id}`, level).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  deleteLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}
