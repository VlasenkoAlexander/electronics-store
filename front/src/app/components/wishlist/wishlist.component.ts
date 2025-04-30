// src/app/components/wishlist/wishlist.component.ts
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadWishlist();
  }

  private loadWishlist(): void {
    this.loading = true;
    this.error = null;
    this.wishlistService.getWishlist().subscribe({
      next: prods => {
        this.products = prods;
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Ошибка при загрузке списка желаемого';
        this.loading = false;
      }
    });
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id).subscribe({
      next: () => {
        this.snackBar.open(
          `${product.name} удалён из списка желаемого`,
          'Закрыть',
          { duration: 3000 }
        );
        this.products = this.products.filter(p => p.id !== product.id);
      },
      error: err => {
        this.snackBar.open(
          err.message || 'Ошибка при удалении из списка желаемого',
          'Закрыть',
          { duration: 3000 }
        );
      }
    });
  }
}