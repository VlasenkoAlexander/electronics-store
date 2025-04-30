import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Coupon } from '../../../models/coupon.model';

export interface CouponDialogData {
  coupon: Coupon | null;
  isNew: boolean;
}

@Component({
  selector: 'app-coupon-form-dialog',
  templateUrl: './coupon-form-dialog.component.html',
  styleUrls: ['./coupon-form-dialog.component.css']
})
export class CouponFormDialogComponent implements OnInit {
  couponForm: FormGroup;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CouponFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CouponDialogData
  ) {
    this.dialogTitle = data.isNew ? 'Добавить купон' : 'Редактировать купон';

    this.couponForm = this.fb.group({
      id: [data.coupon?.id || null],
      code: [data.coupon?.code || '', Validators.required],
      discount: [data.coupon?.discount || 0, [Validators.required, Validators.min(0)]],
      active: [data.coupon?.active ?? true],
      expirationDate: [data.coupon?.expirationDate ? new Date(data.coupon.expirationDate) : null]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.couponForm.valid) {
      const formValue: any = { ...this.couponForm.value };
      if (formValue.expirationDate instanceof Date) {
        formValue.expirationDate = formValue.expirationDate.toISOString();
      }
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
