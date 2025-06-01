import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { ProductSales } from '../../../models/product-sales.model';

@Component({
  selector: 'app-sales-statistics',
  templateUrl: './sales-statistics.component.html',
  styleUrls: ['./sales-statistics.component.css']
})
export class SalesStatisticsComponent implements OnInit {
  filterForm: FormGroup;
  salesData: ProductSales[] = [];
  displayedColumns: string[] = ['productName', 'quantitySold'];

  constructor(private fb: FormBuilder, private salesService: SalesService) {
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
      this.salesService.getSales(fromIso, toIso).subscribe(data => this.salesData = data);
    }
  }
}
