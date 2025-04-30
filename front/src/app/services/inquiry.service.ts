import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inquiry } from '../models/inquiry.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private apiUrl = `${environment.apiUrl}/inquiries`;

  constructor(private http: HttpClient) {}

  getMyInquiries(): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(`${this.apiUrl}/me`);
  }

  getAllInquiries(): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(this.apiUrl);
  }

  createInquiry(data: { subject: string; message: string }): Observable<Inquiry> {
    return this.http.post<Inquiry>(this.apiUrl, data);
  }

  respondInquiry(id: number, response: string): Observable<Inquiry> {
    return this.http.put<Inquiry>(`${this.apiUrl}/${id}/response`, response);
  }
}
