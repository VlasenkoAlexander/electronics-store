import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CouponService } from '../../services/coupon.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  isOrdering: boolean = false;
  city: string = '';
  street: string = '';
  house: string = '';
  apartment: string = '';
  couponCode: string = '';
  discountAmount: number = 0;
  loyaltyDiscountPercent: number = 0;
  loyaltyDiscountAmount: number = 0;
  payableTotal: number = 0;
  couponError: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private couponService: CouponService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(profile => {
      this.loyaltyDiscountPercent = profile.discountPercent || 0;
      this.cartService.getCart().subscribe(items => {
        this.cartItems = items;
        this.total = this.cartService.getCartTotal();
        this.calculateLoyaltyDiscount();
        this.calculatePayableTotal();
      });
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, event: any): void {
    const quantity = parseInt(event.target.value);
    if (!isNaN(quantity)) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  public placeOrder(): void {
    this.isOrdering = true;
  }

  checkCoupon(): void {
    if (!this.couponCode) {
      this.discountAmount = 0;
      this.couponError = '';
      this.calculatePayableTotal();
      return;
    }
    this.couponService.getCouponByCode(this.couponCode).subscribe({
      next: c => { this.discountAmount = c.discount; this.couponError = ''; this.calculatePayableTotal(); },
      error: err => { this.discountAmount = 0; this.couponError = err.status === 404 ? 'Купон не найден' : 'Купон недействительный или просрочен'; this.calculatePayableTotal(); }
    });
  }

  public confirmOrder(): void {
    if (this.couponCode && this.couponError) {
      alert(this.couponError);
      return;
    }
    const deliveryAddress = `${this.city}, ${this.street}, дом ${this.house}, кв ${this.apartment}`;
    const productIds: number[] = [];
    this.cartItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        productIds.push(item.product.id);
      }
    });
    this.orderService.createOrder(productIds, deliveryAddress, this.couponCode).subscribe({
      next: () => {
        const msg = this.discountAmount || this.loyaltyDiscountAmount ? `Заказ успешно оформлен! Скидка: ${this.discountAmount + this.loyaltyDiscountAmount} RUB` : 'Заказ успешно оформлен!';
        alert(msg);
        this.clearCart();
        this.isOrdering = false;
        this.city = this.street = this.house = this.apartment = this.couponCode = this.discountAmount = this.loyaltyDiscountAmount = '' as any;
      },
      error: (err) => {
        console.error('Ошибка при оформлении заказа:', err);
        const msg = err.error?.message || `${err.status} ${err.statusText}`;
        alert('Не удалось оформить заказ: ' + msg);
      }
    });
  }

  public cancelOrder(): void {
    this.isOrdering = false;
    this.city = this.street = this.house = this.apartment = '';
  }

  private calculateLoyaltyDiscount(): void {
    this.loyaltyDiscountAmount = this.total * (this.loyaltyDiscountPercent / 100);
  }

  private calculatePayableTotal(): void {
    this.payableTotal = this.total - this.loyaltyDiscountAmount - (this.discountAmount || 0);
    if (this.payableTotal < 0) {
      this.payableTotal = 0;
    }
  }
}
