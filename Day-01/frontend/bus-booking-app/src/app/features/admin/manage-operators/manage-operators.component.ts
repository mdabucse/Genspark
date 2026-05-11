import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService, OperatorData } from '../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from './confirm-action-dialog.component';

@Component({
  selector: 'app-manage-operators',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="operators-container">
      <div class="header">
        <h1>Manage Operators</h1>
      </div>

      <mat-card>
        <mat-card-content>
          @if (isLoading) {
            <div class="loading-state">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="operators" class="mat-elevation-z0">
              
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef> Operator Name </th>
                <td mat-cell *matCellDef="let op"> 
                  <div class="op-info">
                    <strong>{{op.name}}</strong>
                    <span class="email">{{op.email}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef> Contact </th>
                <td mat-cell *matCellDef="let op"> {{op.phone || 'N/A'}} </td>
              </ng-container>

              <ng-container matColumnDef="buses">
                <th mat-header-cell *matHeaderCellDef> Buses </th>
                <td mat-cell *matCellDef="let op"> {{op.busCount}} </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef> Status </th>
                <td mat-cell *matCellDef="let op"> 
                  @if (!op.isVerified) {
                    <mat-chip color="accent" selected>Pending Approval</mat-chip>
                  } @else if (op.isActive) {
                    <mat-chip color="primary" selected>Active</mat-chip>
                  } @else {
                    <mat-chip color="warn" selected>Blocked</mat-chip>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="action-column"> Actions </th>
                <td mat-cell *matCellDef="let op" class="action-column"> 
                  @if (!op.isVerified) {
                    <button mat-icon-button color="primary" matTooltip="Approve Operator" (click)="approve(op.id)">
                      <mat-icon>check_circle</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" matTooltip="Reject Operator" (click)="reject(op.id)">
                      <mat-icon>cancel</mat-icon>
                    </button>
                  } @else if (op.isActive) {
                    <button mat-icon-button color="warn" matTooltip="Block Operator" (click)="block(op.id)">
                      <mat-icon>block</mat-icon>
                    </button>
                  } @else {
                    <button mat-icon-button color="primary" matTooltip="Unblock Operator" (click)="unblock(op.id)">
                      <mat-icon>lock_open</mat-icon>
                    </button>
                  }
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            @if (operators.length === 0) {
              <div class="empty-state">
                <p>No operators found.</p>
              </div>
            }
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .operators-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 24px;
      h1 { margin: 0; color: #333; }
    }
    .loading-state {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    table {
      width: 100%;
    }
    .op-info {
      display: flex;
      flex-direction: column;
      strong { font-size: 1rem; }
      .email { color: #666; font-size: 0.85rem; }
    }
    .action-column {
      text-align: right;
      padding-right: 16px !important;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class ManageOperatorsComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);

  operators: OperatorData[] = [];
  displayedColumns: string[] = ['name', 'phone', 'buses', 'status', 'actions'];
  isLoading = true;

  ngOnInit() {
    this.loadOperators();
  }

  loadOperators() {
    this.isLoading = true;
    this.adminService.getOperators().subscribe({
      next: (data) => {
        this.operators = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  approve(id: number) {
    if (confirm('Approve this operator?')) {
      this.adminService.approveOperator(id).subscribe(() => {
        this.toastr.success('Operator approved');
        this.loadOperators();
      });
    }
  }

  reject(id: number) {
    if (confirm('Reject this operator? They will be removed.')) {
      this.adminService.rejectOperator(id).subscribe(() => {
        this.toastr.success('Operator rejected');
        this.loadOperators();
      });
    }
  }

  block(id: number) {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        this.adminService.blockOperator(id, password).subscribe({
          next: () => {
            this.toastr.success('Password verified. Operator blocked.');
            this.loadOperators();
          },
          error: (err) => {
            // Toastr already handles error messages via interceptor, but we can add specific handling if needed
          }
        });
      }
    });
  }

  unblock(id: number) {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        this.adminService.unblockOperator(id, password).subscribe({
          next: () => {
            this.toastr.success('Password verified. Operator unblocked.');
            this.loadOperators();
          }
        });
      }
    });
  }
}
