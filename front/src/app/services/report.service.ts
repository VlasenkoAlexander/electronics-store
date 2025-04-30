import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReportSummary } from '../models/report-summary.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.apiUrl}/summary`);
  }
}
