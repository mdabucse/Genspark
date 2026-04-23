import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OperatorService, OperatorBooking } from '../../../core/services/operator.service';

@Component({
  selector: 'app-operator-bookings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="bookings">
      <h1>Bookings on My Buses</h1>

      @if (isLoading) {
        <div class="loading"><mat-spinner></mat-spinner></div>
      } @else {
        <mat-card class="table-card">
          <table mat-table [dataSource]="bookings" class="full-width">
            <ng-container matColumnDef="bookingRef">
              <th mat-header-cell *matHeaderCellDef>Booking Ref</th>
              <td mat-cell *matCellDef="let b">{{ b.bookingRef }}</td>
            </ng-container>

            <ng-container matColumnDef="userName">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let b">{{ b.userName }}</td>
            </ng-container>

            <ng-container matColumnDef="busName">
              <th mat-header-cell *matHeaderCellDef>Bus</th>
              <td mat-cell *matCellDef="let b">{{ b.busName }}</td>
            </ng-container>

            <ng-container matColumnDef="route">
              <th mat-header-cell *matHeaderCellDef>Route</th>
              <td mat-cell *matCellDef="let b">{{ b.route }}</td>
            </ng-container>

            <ng-container matColumnDef="departure">
              <th mat-header-cell *matHeaderCellDef>Departure</th>
              <td mat-cell *matCellDef="let b">{{ b.departureTime | date:'medium' }}</td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let b">₹{{ b.totalAmount | number:'1.0-0' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let b">
                <span [class]="'badge ' + b.status">{{ b.status }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="bookedAt">
              <th mat-header-cell *matHeaderCellDef>Booked At</th>
              <td mat-cell *matCellDef="let b">{{ b.bookedAt | date:'short' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          @if (bookings.length === 0) {
            <div class="empty-state">
              <mat-icon>inbox</mat-icon>
              <p>No bookings found yet</p>
            </div>
          }
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .bookings { max-width: 1200px; }
    h1 { margin-bottom: 24px; color: #333; }
    .loading { display: flex; justify-content: center; padding: 60px 0; }
    .table-card { padding: 0; overflow-x: auto; }
    .full-width { width: 100%; }
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge.confirmed { background: #e8f5e9; color: #2e7d32; }
    .badge.pending { background: #fff3e0; color: #e65100; }
    .badge.cancelled { background: #fce4ec; color: #c62828; }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
      p { margin-top: 8px; }
    }
  `]
})
export class OperatorBookingsComponent implements OnInit {
  private operatorService = inject(OperatorService);

  bookings: OperatorBooking[] = [];
  isLoading = true;
  displayedColumns = ['bookingRef', 'userName', 'busName', 'route', 'departure', 'amount', 'status', 'bookedAt'];

  ngOnInit() {
    this.operatorService.getMyBookings().subscribe({
      next: (data) => { this.bookings = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }
}
