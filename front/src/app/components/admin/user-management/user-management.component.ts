import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['username','lastName','firstName','middleName','birthDate','phone','email','role','createdAt','actions'];
  users: any[] = [];
  loading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить пользователей';
        this.loading = false;
      }
    });
  }

  public deleteUser(user: any): void {
    if (confirm(`Удалить пользователя ${user.username}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: () => {
          alert('Не удалось удалить пользователя');
        }
      });
    }
  }

  public mapRole(role: string): string {
    if (role === 'ROLE_ADMIN') return 'Администратор';
    if (role === 'ROLE_USER') return 'Покупатель';
    return role;
  }
}
