import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from '../../../services/loyalty.service';
import { LoyaltyLevel } from '../../../models/loyalty-level.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoyaltyLevelFormDialogComponent, LoyaltyLevelDialogData } from '../loyalty-level-form-dialog/loyalty-level-form-dialog.component';

@Component({
  selector: 'app-loyalty-level-management',
  templateUrl: './loyalty-level-management.component.html',
  styleUrls: ['./loyalty-level-management.component.css']
})
export class LoyaltyLevelManagementComponent implements OnInit {
  levels: LoyaltyLevel[] = [];
  loading = true;
  error = '';

  displayedColumns: string[] = ['name', 'minTotal', 'discountPercent', 'actions'];

  constructor(
    private loyaltyService: LoyaltyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLevels();
  }

  loadLevels(): void {
    this.loading = true;
    this.loyaltyService.getAllLevels().subscribe({
      next: data => { this.levels = data; this.loading = false; },
      error: () => { this.error = 'Не удалось загрузить уровни лояльности'; this.loading = false; }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(LoyaltyLevelFormDialogComponent, {
      width: '400px',
      data: { level: null, isNew: true } as LoyaltyLevelDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loyaltyService.createLevel(result).subscribe({
          next: () => {
            this.snackBar.open('Уровень лояльности создан', 'Закрыть', { duration: 3000 });
            this.loadLevels();
          },
          error: () => this.snackBar.open('Ошибка при создании уровня', 'Закрыть', { duration: 3000 })
        });
      }
    });
  }

  openEditDialog(level: LoyaltyLevel): void {
    const dialogRef = this.dialog.open(LoyaltyLevelFormDialogComponent, {
      width: '400px',
      data: { level: { ...level }, isNew: false } as LoyaltyLevelDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loyaltyService.updateLevel(level.id, result).subscribe({
          next: () => {
            this.snackBar.open('Уровень лояльности обновлён', 'Закрыть', { duration: 3000 });
            this.loadLevels();
          },
          error: () => this.snackBar.open('Ошибка при обновлении уровня', 'Закрыть', { duration: 3000 })
        });
      }
    });
  }

  deleteLevel(levelId: number): void {
    if (confirm('Удалить уровень лояльности?')) {
      this.loyaltyService.deleteLevel(levelId).subscribe({
        next: () => {
          this.snackBar.open('Уровень удалён', 'Закрыть', { duration: 3000 });
          this.loadLevels();
        },
        error: () => this.snackBar.open('Ошибка при удалении уровня', 'Закрыть', { duration: 3000 })
      });
    }
  }
}
