import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../services/coupon.service';
import { Coupon } from '../../../models/coupon.model';
import { MatDialog } from '@angular/material/dialog';
import { CouponFormDialogComponent, CouponDialogData } from '../coupon-form-dialog/coupon-form-dialog.component';

@Component({
  selector: 'app-coupon-management',
  templateUrl: './coupon-management.component.html',
  styleUrls: ['./coupon-management.component.css']
})
export class CouponManagementComponent implements OnInit {
  displayedColumns: string[] = ['code', 'discount', 'active', 'expirationDate', 'actions'];
  coupons: Coupon[] = [];
  loading = true;
  error = '';

  constructor(private couponService: CouponService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.loading = true;
    this.couponService.getAllCoupons().subscribe({
      next: (data) => { this.coupons = data; this.loading = false; },
      error: () => { this.error = 'Не удалось загрузить купоны'; this.loading = false; }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CouponFormDialogComponent, {
      width: '400px',
      data: { coupon: null, isNew: true } as CouponDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.couponService.createCoupon(result).subscribe({
          next: () => this.loadCoupons(),
          error: () => alert('Не удалось создать купон')
        });
      }
    });
  }

  openEditDialog(coupon: Coupon): void {
    const dialogRef = this.dialog.open(CouponFormDialogComponent, {
      width: '400px',
      data: { coupon, isNew: false } as CouponDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.couponService.updateCoupon(coupon.id!, result).subscribe({
          next: () => this.loadCoupons(),
          error: () => alert('Не удалось обновить купон')
        });
      }
    });
  }

  deleteCoupon(coupon: Coupon): void {
    if (confirm(`Удалить купон ${coupon.code}?`)) {
      this.couponService.deleteCoupon(coupon.id!).subscribe({
        next: () => this.loadCoupons(),
        error: () => alert('Не удалось удалить купон')
      });
    }
  }
}
