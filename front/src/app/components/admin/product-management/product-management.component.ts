import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  displayedColumns: string[] = ['brand', 'name', 'price', 'stock', 'category', 'actions'];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is admin, if not redirect to home
    if (!this.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Sort by ID to preserve original catalog order
        this.products = products.sort((a, b) => a.id - b.id);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Произошла ошибка при загрузке товаров';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '600px',
      data: { product: null, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addProduct(result);
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '600px',
      data: { product: {...product}, isNew: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProduct(result);
      }
    });
  }

  addProduct(product: Product): void {
    this.productService.addProduct(product).subscribe({
      next: (newProduct) => {
        // Обновляем весь список товаров, чтобы гарантировать актуальность данных
        this.loadProducts();
        this.snackBar.open('Товар успешно добавлен', 'Закрыть', {
          duration: 3000
        });
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Ошибка при добавлении товара', 'Закрыть', {
          duration: 3000
        });
      }
    });
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe({
      next: (updatedProduct) => {
        // Обновляем весь список товаров, чтобы гарантировать актуальность данных
        this.loadProducts();
        this.snackBar.open('Товар успешно обновлен', 'Закрыть', {
          duration: 3000
        });
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Ошибка при обновлении товара', 'Закрыть', {
          duration: 3000
        });
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // Обновляем весь список товаров, чтобы гарантировать актуальность данных
          this.loadProducts();
          this.snackBar.open('Товар успешно удален', 'Закрыть', {
            duration: 3000
          });
        },
        error: (err) => {
          this.snackBar.open(err.message || 'Ошибка при удалении товара', 'Закрыть', {
            duration: 3000
          });
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
