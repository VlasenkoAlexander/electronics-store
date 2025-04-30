import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /** ADMIN: Get all users */
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(data => console.log('Received users:', data)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
        return throwError(() => error);
      })
    );
  }

  /** ADMIN: Delete user */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      tap(() => console.log('User deleted:', userId)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  /** Get current user's profile */
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching profile:', error);
        return throwError(() => error);
      })
    );
  }

  /** Update current user's profile */
  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, profileData).pipe(
      tap(data => console.log('Profile updated:', data)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }

  /** Delete current user's account */
  deleteCurrentUser(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`).pipe(
      tap(() => console.log('Current user deleted')),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting current user:', error);
        return throwError(() => error);
      })
    );
  }
}
