import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  totalSpent = 0;
  loyaltyLevel = '';
  discountPercent = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      firstName: [''],
      lastName: [''],
      middleName: [''],
      birthDate: [''],
      phone: ['']
    });
    this.userService.getProfile().subscribe(
      data => {
        this.profileForm.patchValue({
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          birthDate: data.birthDate,
          phone: data.phone
        });
        this.totalSpent = data.totalSpent;
        this.loyaltyLevel = data.loyaltyLevel;
        this.discountPercent = data.discountPercent;
      },
      error => this.errorMessage = 'Ошибка при загрузке профиля'
    );
  }

  onSubmit(): void {
    if (this.profileForm.invalid) { return; }
    const formValue = this.profileForm.value;
    const updateData: any = {
      username: formValue.username,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      middleName: formValue.middleName,
      birthDate: formValue.birthDate,
      phone: formValue.phone
    };
    if (formValue.password) {
      updateData.password = formValue.password;
    }
    this.userService.updateProfile(updateData).subscribe(
      data => {
        this.successMessage = 'Профиль успешно обновлен';
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.username = data.username;
        currentUser.email = data.email;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      },
      error => this.errorMessage = 'Ошибка при обновлении профиля'
    );
  }

  /** Удаление собственного аккаунта */
  deleteAccount(): void {
    this.userService.deleteCurrentUser().subscribe(
      () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error => this.errorMessage = 'Ошибка при удалении аккаунта'
    );
  }
}
