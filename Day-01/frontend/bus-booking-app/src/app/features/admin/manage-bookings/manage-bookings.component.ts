import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdminService, OperatorData } from '../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSelectModule, 
    MatFormFieldModule,
    MatCardModule,
    MatPaginatorModule
  ],
  template: `
    <div class="admin-bookings-container">
      <div class="header-section">
        <h1>Passenger Booking Details</h1>
        <p>Comprehensive overview of all bookings across operators</p>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filter-grid">
            <mat-form-field appearance="outline">
              <mat-label>Filter by Bus Operator</mat-label>
              <mat-select [(ngModel)]="selectedOperatorId" (selectionChange)="onFilterChange()">
                <mat-option [value]="null">All Operators</mat-option>
                @for (op of operators; track op.id) {
                  <mat-option [value]="op.id">{{ op.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="table-container mat-elevation-z2">
        <table mat-table [dataSource]="bookings">
          <!-- Ref Column -->
          <ng-container matColumnDef="ref">
            <th mat-header-cell *matHeaderCellDef>Booking ID</th>
            <td mat-cell *matCellDef="let b">
              <span class="ref-badge">{{ b.bookingRef }}</span>
            </td>
          </ng-container>

          <!-- User Column -->
          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef>Customer</th>
            <td mat-cell *matCellDef="let b">
              <div class="user-info">
                <strong>{{ b.userName }}</strong>
                <span>{{ b.userEmail }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Operator Column -->
          <ng-container matColumnDef="operator">
            <th mat-header-cell *matHeaderCellDef>Operator / Bus</th>
            <td mat-cell *matCellDef="let b">
              <div class="op-bus">
                <span class="op-tag">{{ b.operatorName }}</span>
                <span class="bus-name">{{ b.busName }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Trip Column -->
          <ng-container matColumnDef="trip">
            <th mat-header-cell *matHeaderCellDef>Route & Date</th>
            <td mat-cell *matCellDef="let b">
              <div class="trip-info">
                <strong>{{ b.route }}</strong>
                <span>{{ b.departureTime | date:'medium' }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Passengers Column -->
          <ng-container matColumnDef="passengers">
            <th mat-header-cell *matHeaderCellDef>Passenger Details</th>
            <td mat-cell *matCellDef="let b">
              <div class="passengers-list">
                @for (p of b.passengers; track p.seatNumber) {
                  <div class="passenger-item">
                    <mat-icon>person</mat-icon>
                    <span>{{ p.name }} ({{ p.age }}{{ p.gender[0] }}) - <b>{{ p.seatNumber }}</b></span>
                  </div>
                }
              </div>
            </td>
          </ng-container>

          <!-- Amount Column -->
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let b">
              <span class="amount">₹{{ b.totalAmount }}</span>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let b">
              <span class="status-badge" [class]="b.status">{{ b.status }}</span>
            </td>
          </ng-container>

          <!-- Booked At Column -->
          <ng-container matColumnDef="bookedAt">
            <th mat-header-cell *matHeaderCellDef>Booked At</th>
            <td mat-cell *matCellDef="let b">
              <div class="booked-at">
                <strong>{{ b.bookedAt | date:'dd MMM' }}</strong>
                <span>{{ b.bookedAt | date:'shortTime' }}</span>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator 
          [length]="totalBookings"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .admin-bookings-container {
      padding: 32px;
      background: #f4f7fe;
      min-height: 100vh;
    }

    .header-section {
      margin-bottom: 32px;
      h1 { font-size: 2.2rem; font-weight: 800; color: #1b2559; margin-bottom: 8px; }
      p { color: #a3aed0; font-size: 1.1rem; }
    }

    .filter-card {
      margin-bottom: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      .filter-grid { width: 300px; }
      mat-form-field { width: 100%; }
    }

    .table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    table { width: 100%; }

    .mat-column-ref { width: 120px; }
    .mat-column-status { width: 100px; }
    .mat-column-amount { width: 100px; }

    .ref-badge {
      background: #f4f7fe;
      color: #4318ff;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .user-info, .trip-info, .op-bus {
      display: flex;
      flex-direction: column;
      strong { color: #1b2559; font-size: 0.95rem; }
      span { color: #a3aed0; font-size: 0.85rem; }
    }

    .op-tag {
      background: #e2e8f0;
      color: #4a5568;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      width: fit-content;
      margin-bottom: 4px;
    }

    .passengers-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px 0;
    }

    .passenger-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #4a5568;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #a3aed0; }
      b { color: #4318ff; }
    }

    .amount {
      font-weight: 800;
      color: #1b2559;
      font-size: 1.1rem;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      display: inline-block;
      text-align: center;
      min-width: 80px;

      &.confirmed { background: #e6fffa; color: #065f46; }
      &.pending { background: #fffaf0; color: #9c4221; }
      &.cancelled { background: #fff5f5; color: #9b2c2c; }
      &.completed { background: #f0f9ff; color: #075985; }
    }

    th.mat-header-cell {
      background: #f4f7fe;
      color: #a3aed0;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      padding: 20px 16px;
    }

    .booked-at {
      display: flex; flex-direction: column;
      strong { color: #1b2559; font-size: 0.85rem; }
      span { color: #a3aed0; font-size: 0.75rem; }
    }

    tr:hover td { background: #f9fafb; }
  `]
})
export class ManageBookingsComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  bookings: any[] = [];
  operators: OperatorData[] = [];
  totalBookings = 0;
  pageSize = 10;
  currentPage = 0;
  selectedOperatorIdIndex: number | null = null;
  selectedOperatorId: number | null = null;

  displayedColumns: string[] = ['ref', 'user', 'operator', 'trip', 'passengers', 'amount', 'status', 'bookedAt'];

  ngOnInit() {
    this.loadOperators();
    this.loadBookings();
  }

  loadOperators() {
    this.adminService.getOperators().subscribe(ops => this.operators = ops);
  }

  loadBookings() {
    this.adminService.getBookings(this.selectedOperatorId || undefined, this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (res) => {
          this.bookings = res.bookings;
          this.totalBookings = res.total;
        },
        error: () => this.toastr.error('Failed to load bookings')
      });
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadBookings();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadBookings();
  }
}
