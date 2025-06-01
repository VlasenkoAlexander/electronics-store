import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomerSales } from '../models/customer-sales.model';

@Injectable({ providedIn: 'root' })
export class CustomerSalesService {
  private apiUrl = `${environment.apiUrl}/admin/customer-sales`;

  constructor(private http: HttpClient) {}

  getCustomerSales(from: string, to: string): Observable<CustomerSales[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<CustomerSales[]>(this.apiUrl, { params });
  }
}
