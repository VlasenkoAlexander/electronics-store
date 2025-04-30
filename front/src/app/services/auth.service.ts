import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private userService: UserService) {
    // Проверяем наличие токена при инициализации
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
    
    // Загружаем информацию о текущем пользователе
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUserSubject.next(JSON.parse(currentUser));
    }
    // При наличии токена обновляем профиль с сервера для получения роли
    if (token) {
      this.userService.getProfile().subscribe({
        next: user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        },
        error: () => this.logout()
      });
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        const token = response.accessToken || response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      switchMap(() => this.userService.getProfile()),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Ошибка при входе:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
  
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return !!currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'ROLE_ADMIN');
  }
} 