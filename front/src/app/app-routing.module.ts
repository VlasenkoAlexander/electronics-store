import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './components/admin/product-management/product-management.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminGuard } from './guards/admin.guard';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CouponManagementComponent } from './components/admin/coupon-management/coupon-management.component';
import { AdminReportsComponent } from './components/admin/admin-reports/admin-reports.component';
import { LoyaltyLevelManagementComponent } from './components/admin/loyalty-level-management/loyalty-level-management.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { InquiriesComponent } from './components/inquiries/inquiries.component';
import { SalesStatisticsComponent } from './components/admin/sales-statistics/sales-statistics.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/products', component: ProductManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/coupons', component: CouponManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/reports', component: AdminReportsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/loyalty-levels', component: LoyaltyLevelManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/sales', component: SalesStatisticsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'inquiries', component: InquiriesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }