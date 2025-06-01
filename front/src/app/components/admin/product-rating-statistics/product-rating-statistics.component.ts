import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductRatingService } from '../../../services/product-rating.service';
import { ProductRating } from '../../../models/product-rating.model';

@Component({
  selector: 'app-product-rating-statistics',
  templateUrl: './product-rating-statistics.component.html',
  styleUrls: ['./product-rating-statistics.component.css']
})
export class ProductRatingStatisticsComponent implements OnInit {
  filterForm: FormGroup;
  ratings: ProductRating[] = [];
  displayedColumns: string[] = ['productName', 'averageRating'];

  constructor(private fb: FormBuilder, private productRatingService: ProductRatingService) {
    this.filterForm = this.fb.group({ from: [null], to: [null] });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const { from, to } = this.filterForm.value;
    if (from && to) {
      const fromIso = (from as Date).toISOString();
      const toIso = (to as Date).toISOString();
      this.productRatingService.getRatings(fromIso, toIso)
        .subscribe(data => this.ratings = data);
    }
  }
}
