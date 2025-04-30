import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'store-frontend';
  cartItemCount = 0;
  isAdminFlag: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // Подписка на профиль для отображения админ-кнопки
    this.authService.getCurrentUser().subscribe(user => {
      this.isAdminFlag = this.authService.isAdmin();
    });
    this.cartService.getCart().subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }
}