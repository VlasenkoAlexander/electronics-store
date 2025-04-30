import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  displayedColumns: string[] = ['user', 'orderDate', 'deliveryAddress', 'totalPrice', 'products', 'actions'];
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  /** ADMIN: delete order */
  public deleteOrder(order: any): void {
    if (confirm('Вы действительно хотите удалить этот заказ?')) {
      this.orderService.deleteOrder(order.id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== order.id);
        },
        error: () => {
          alert('Не удалось удалить заказ');
        }
      });
    }
  }
}
