import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../models/coupon.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) {}

  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  getCouponById(id: number): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/${id}`);
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(this.apiUrl, coupon);
  }

  updateCoupon(id: number, coupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, coupon);
  }

  deleteCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** USER: Get coupon by code */
  getCouponByCode(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/code/${code}`);
  }
}
