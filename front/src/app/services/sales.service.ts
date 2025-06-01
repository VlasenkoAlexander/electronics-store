import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductSales } from '../models/product-sales.model';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private apiUrl = `${environment.apiUrl}/admin/sales`;

  constructor(private http: HttpClient) {}

  getSales(from: string, to: string): Observable<ProductSales[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<ProductSales[]>(this.apiUrl, { params });
  }
}
