import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { ReportSummary } from '../../../models/report-summary.model';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  summary: ReportSummary = { totalOrders: 0, totalSales: 0, totalUsers: 0, avgOrderValue: 0, totalReviews: 0, avgRating: 0 };

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getSummary().subscribe(data => this.summary = data);
  }
}
