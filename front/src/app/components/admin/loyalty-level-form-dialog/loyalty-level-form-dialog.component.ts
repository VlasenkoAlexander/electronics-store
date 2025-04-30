import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoyaltyLevel } from '../../../models/loyalty-level.model';

export interface LoyaltyLevelDialogData {
  level: LoyaltyLevel | null;
  isNew: boolean;
}

@Component({
  selector: 'app-loyalty-level-form-dialog',
  templateUrl: './loyalty-level-form-dialog.component.html',
  styleUrls: ['./loyalty-level-form-dialog.component.css']
})
export class LoyaltyLevelFormDialogComponent implements OnInit {
  levelForm: FormGroup;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoyaltyLevelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoyaltyLevelDialogData
  ) {
    this.dialogTitle = data.isNew ? 'Добавить уровень лояльности' : 'Редактировать уровень лояльности';
    this.levelForm = this.fb.group({
      id: [data.level?.id || null],
      name: [data.level?.name || '', Validators.required],
      minTotal: [data.level?.minTotal || 0, [Validators.required, Validators.min(0)]],
      discountPercent: [data.level?.discountPercent || 0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.levelForm.valid) {
      this.dialogRef.close(this.levelForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
