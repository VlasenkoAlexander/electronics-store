import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { Review } from '../../models/review.model';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  reviews: Review[] = [];
  loading = true;
  error: string | null = null;
  newRating = 5;
  newComment = '';
  currentUser: any = null;
  editingReviewId?: number;
  editedRating = 5;
  editedComment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.loadProductAndReviews();
    this.authService.getCurrentUser().subscribe(user => this.currentUser = user);
  }

  private loadProductAndReviews(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe({
      next: (prod) => {
        this.product = prod;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Произошла ошибка при загрузке товара';
        this.loading = false;
      }
    });
    this.reviewService.getReviews(id).subscribe({
      next: (revs) => this.reviews = revs,
      error: (err) => console.error('Ошибка при загрузке отзывов', err)
    });
  }

  canReview(): boolean {
    return this.authService.isAuthenticated();
  }

  submitReview(): void {
    if (!this.product) return;
    this.reviewService.addReview(this.product.id, { rating: this.newRating, comment: this.newComment }).subscribe({
      next: (review) => {
        this.reviews.push(review);
        this.snackBar.open('Отзыв отправлен', 'Закрыть', { duration: 3000 });
        this.newRating = 5;
        this.newComment = '';
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Ошибка при добавлении отзыва', 'Закрыть', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  startEditReview(review: Review): void {
    this.editingReviewId = review.id;
    this.editedRating = review.rating;
    this.editedComment = review.comment;
  }

  saveEditReview(review: Review): void {
    this.reviewService.updateReview(this.product.id, review.id, { rating: this.editedRating, comment: this.editedComment })
      .subscribe({
        next: updated => {
          const idx = this.reviews.findIndex(r => r.id === updated.id);
          if (idx > -1) this.reviews[idx] = updated;
          this.editingReviewId = undefined;
          this.snackBar.open('Отзыв обновлён', 'Закрыть', { duration: 3000 });
        },
        error: err => this.snackBar.open(err.message || 'Ошибка при обновлении отзыва', 'Закрыть', { duration: 3000 })
      });
  }

  cancelEditReview(): void {
    this.editingReviewId = undefined;
  }

  deleteReview(review: Review): void {
    this.reviewService.deleteReview(this.product.id, review.id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== review.id);
        this.snackBar.open('Отзыв удалён', 'Закрыть', { duration: 3000 });
      },
      error: err => this.snackBar.open(err.message || 'Ошибка при удалении отзыва', 'Закрыть', { duration: 3000 })
    });
  }

  /** Add current product to cart */
  addToCart(): void {
    this.cartService.addToCart(this.product);
    this.snackBar.open(`${this.product.name} добавлен в корзину`, 'Закрыть', { duration: 3000 });
  }

  /** Добавить товар в список желаемого */
  addToWishlist(): void {
    this.wishlistService.addToWishlist(this.product.id).subscribe({
      next: () => this.snackBar.open(`${this.product.name} добавлен в избранное`, 'Закрыть', { duration: 3000 }),
      error: err => this.snackBar.open(err.message || 'Ошибка при добавлении в избранное', 'Закрыть', { duration: 3000 })
    });
  }

  // вычисляемый геттер: средний рейтинг товара
  get averageRating(): number {
    if (!this.reviews || this.reviews.length === 0) {
      return 0;
    }
    const sum = this.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return sum / this.reviews.length;
  }
}
