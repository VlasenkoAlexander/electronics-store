import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerSalesService } from '../../../services/customer-sales.service';
import { CustomerSales } from '../../../models/customer-sales.model';

@Component({
  selector: 'app-customer-sales-statistics',
  templateUrl: './customer-sales-statistics.component.html',
  styleUrls: ['./customer-sales-statistics.component.css']
})
export class CustomerSalesStatisticsComponent implements OnInit {
  filterForm: FormGroup;
  salesData: CustomerSales[] = [];
  displayedColumns: string[] = ['username', 'totalSpent'];

  constructor(private fb: FormBuilder, private customerSalesService: CustomerSalesService) {
    this.filterForm = this.fb.group({
      from: [null],
      to: [null]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const { from, to } = this.filterForm.value;
    if (from && to) {
      const fromIso = (from as Date).toISOString();
      const toIso = (to as Date).toISOString();
      this.customerSalesService.getCustomerSales(fromIso, toIso)
        .subscribe(data => this.salesData = data);
    }
  }
}
