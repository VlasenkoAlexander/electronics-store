import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';

export interface ProductDialogData {
  product: Product | null;
  isNew: boolean;
}

@Component({
  selector: 'app-product-form-dialog',
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.css']
})
export class ProductFormDialogComponent implements OnInit {
  productForm: FormGroup;
  dialogTitle: string;
  
  categories: string[] = [
    'Смартфоны',
    'Ноутбуки',
    'Аудио',
    'Гаджеты',
    'Телевизоры',
    'Игры',
    'Аксессуары'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) {
    this.dialogTitle = data.isNew ? 'Добавить товар' : 'Редактировать товар';
    
    this.productForm = this.fb.group({
      id: [data.product?.id || null],
      brand: [data.product?.brand || '', Validators.required],
      name: [data.product?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [data.product?.description || '', Validators.required],
      price: [data.product?.price || 0, [Validators.required, Validators.min(0)]],
      stock: [data.product?.stock || 0, [Validators.required, Validators.min(0)]],
      category: [data.product?.category || '', Validators.required],
      imageUrl: [data.product?.imageUrl || '']
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
