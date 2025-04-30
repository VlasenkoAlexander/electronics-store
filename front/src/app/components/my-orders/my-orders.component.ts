import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';
  displayedColumns: string[] = ['orderDate', 'deliveryAddress', 'totalPrice', 'products', 'actions'];
  editingOrderId: number | null = null;
  editedAddress: string = '';
  editedProducts: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (data: any) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Не удалось загрузить ваши заказы';
        this.loading = false;
      }
    });
  }

  public editOrder(order: any): void {
    this.editingOrderId = order.id;
    this.editedAddress = order.deliveryAddress;
    this.editedProducts = [...order.products];
  }

  public deleteOrder(order: any): void {
    if (confirm('Вы действительно хотите отменить этот заказ?')) {
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

  public removeProduct(index: number): void {
    this.editedProducts.splice(index, 1);
  }

  public saveEdit(order: any): void {
    const productIds = this.editedProducts.map((p: any) => p.id);
    this.orderService.updateOrder(order.id, productIds, this.editedAddress).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx > -1) {
          this.orders[idx] = updated;
          // update reference to trigger change detection in the table
          this.orders = [...this.orders];
        }
        this.editingOrderId = null;
      },
      error: () => {
        alert('Не удалось обновить заказ');
      }
    });
  }

  public cancelEdit(): void {
    this.editingOrderId = null;
  }
}
