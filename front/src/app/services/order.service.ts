import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  /** ADMIN: Get all orders */
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** USER: Get own orders */
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }

  /** USER: Create order */
  createOrder(productIds: number[], deliveryAddress: string, couponCode: string): Observable<any> {
    console.log('Creating order with products, address and coupon:', productIds, deliveryAddress, couponCode);
    return this.http.post<any>(this.apiUrl, { productIds, deliveryAddress, couponCode }).pipe(
      tap(data => console.log('Order created:', data)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating order:', error);
        return throwError(() => error);
      })
    );
  }

  /** USER: Cancel/delete order */
  deleteOrder(orderId: number): Observable<void> {
    console.log('Deleting order:', orderId);
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }

  /** Обновление заказа */
  updateOrder(orderId: number, productIds: number[], deliveryAddress: string): Observable<any> {
    console.log('Updating order:', orderId, productIds, deliveryAddress);
    return this.http.put<any>(`${this.apiUrl}/${orderId}`, { productIds, deliveryAddress }).pipe(
      tap(data => console.log('Order updated:', data)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating order:', error);
        return throwError(() => error);
      })
    );
  }
}
