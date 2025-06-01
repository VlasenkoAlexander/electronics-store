import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CartComponent } from './components/cart/cart.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './components/admin/product-management/product-management.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { ProductFormDialogComponent } from './components/admin/product-form-dialog/product-form-dialog.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
// Добавлено для управления купонами
import { CouponManagementComponent } from './components/admin/coupon-management/coupon-management.component';
import { CouponFormDialogComponent } from './components/admin/coupon-form-dialog/coupon-form-dialog.component';
import { AdminReportsComponent } from './components/admin/admin-reports/admin-reports.component';
import { LoyaltyLevelManagementComponent } from './components/admin/loyalty-level-management/loyalty-level-management.component';
import { LoyaltyLevelFormDialogComponent } from './components/admin/loyalty-level-form-dialog/loyalty-level-form-dialog.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { InquiriesComponent } from './components/inquiries/inquiries.component';
import { SalesStatisticsComponent } from './components/admin/sales-statistics/sales-statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    DashboardComponent,
    CartComponent,
    AdminDashboardComponent,
    ProductManagementComponent,
    ProductFormDialogComponent,
    AdminOrdersComponent,
    MyOrdersComponent,
    UserManagementComponent,
    CouponManagementComponent,
    CouponFormDialogComponent,
    AdminReportsComponent,
    ProfileComponent,
    ProductDetailComponent,
    LoyaltyLevelManagementComponent,
    LoyaltyLevelFormDialogComponent,
    WishlistComponent,
    InquiriesComponent,
    SalesStatisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatExpansionModule,
    RouterModule
  ],
  providers: [
    provideAnimationsAsync(),
    AuthService,
    ProductService,
    CartService,
    AuthGuard,
    AdminGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }