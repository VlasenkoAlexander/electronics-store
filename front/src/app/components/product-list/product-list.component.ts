import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  sortOptions = [
    { value: '', viewValue: 'По умолчанию' },
    { value: 'price-asc', viewValue: 'Цена ↑' },
    { value: 'price-desc', viewValue: 'Цена ↓' },
    { value: 'rating-asc', viewValue: 'Рейтинг ↑' },
    { value: 'rating-desc', viewValue: 'Рейтинг ↓' }
  ];
  selectedSort: string = '';
  loading = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts(this.searchTerm).subscribe({
      next: (products) => {
        // compute average rating
        this.products = products.map(p => ({
          ...p,
          averageRating: p.reviews?.length
            ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
            : 0
        }));
        // extract categories
        this.categories = Array.from(new Set(this.products.map(p => p.category).filter((c): c is string => !!c)));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке продуктов:', err);
        this.error = err.message || 'Произошла ошибка при загрузке товаров';
        this.loading = false;
      }
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  retryLoad(): void {
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} добавлен в корзину`, 'Закрыть', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  addToWishlist(p: Product) {
    this.wishlistService.addToWishlist(p.id).subscribe(() => {
      this.snackBar.open(`${p.name} добавлен в избранное`, 'Закрыть', { duration: 3000 });
    });
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  onSearch(): void {
    this.loadProducts();
  }

  applyFilters(): void {
    let prods = [...this.products];
    if (this.selectedCategory) {
      prods = prods.filter(p => p.category === this.selectedCategory);
    }
    switch (this.selectedSort) {
      case 'price-asc':
        prods.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        prods.sort((a, b) => b.price - a.price);
        break;
      case 'rating-asc':
        prods.sort((a, b) => (a.averageRating ?? 0) - (b.averageRating ?? 0));
        break;
      case 'rating-desc':
        prods.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
        break;
    }
    this.displayedProducts = prods;
  }
}