import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BookingService } from '../../../core/services/booking.service';
import { CancellationDialogComponent } from './cancellation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="dashboard-page">
      <div class="page-header animate-fade-in-up">
        <div>
          <h1>My <span class="gradient-text">Bookings</span></h1>
          <p>Manage and track all your journeys</p>
        </div>
        <a class="new-booking-btn" routerLink="/">
          <mat-icon>add</mat-icon>
          Book New Trip
        </a>
      </div>

      @if (isLoading) {
        <div class="loading-state">
          <mat-spinner diameter="44"></mat-spinner>
        </div>
      } @else if (bookings.length === 0) {
        <div class="empty-state animate-fade-in-up stagger-1">
          <div class="empty-icon">
            <mat-icon>luggage</mat-icon>
          </div>
          <h3>No bookings yet</h3>
          <p>Start your journey by booking your first trip</p>
          <a class="primary-btn" routerLink="/">
            <mat-icon>search</mat-icon>
            Search Buses
          </a>
        </div>
      } @else {
        <div class="bookings-list">
          @for (booking of bookings; track booking.bookingId; let i = $index) {
            <div class="booking-card animate-fade-in-up" [style.animation-delay]="(i * 0.08 + 0.1) + 's'">
              <!-- Card Header -->
              <div class="card-top">
                <div class="route-info">
                  <span class="city">{{ booking.trip?.source }}</span>
                  <mat-icon class="arrow">arrow_forward</mat-icon>
                  <span class="city">{{ booking.trip?.destination }}</span>
                </div>
                <div class="status-area">
                  <span class="booking-ref">{{ booking.bookingRef }}</span>
                  <span class="status-badge" [class]="booking.status">
                    {{ booking.status | uppercase }}
                  </span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="card-body">
                <div class="details-grid">
                  <div class="detail">
                    <mat-icon>event</mat-icon>
                    <div>
                      <span class="label">Journey Date</span>
                      <span class="value">{{ booking.trip?.departureTime | date:'medium' }}</span>
                    </div>
                  </div>
                  <div class="detail">
                    <mat-icon>directions_bus</mat-icon>
                    <div>
                      <span class="label">Bus</span>
                      <span class="value">{{ booking.trip?.busName }} ({{ booking.trip?.busType }})</span>
                    </div>
                  </div>
                  <div class="detail">
                    <mat-icon>group</mat-icon>
                    <div>
                      <span class="label">Passengers</span>
                      <span class="value">{{ getPassengerNames(booking) }}</span>
                    </div>
                  </div>
                  <div class="detail">
                    <mat-icon>event_seat</mat-icon>
                    <div>
                      <span class="label">Seats</span>
                      <span class="value teal">{{ getSeatNumbers(booking) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer -->
              <div class="card-footer">
                <div class="fare-display">
                  <span class="fare-label">Total Paid</span>
                  <span class="fare-amount">₹{{ booking.totalFare }}</span>
                </div>
                <div class="card-actions-container">
                  <div class="card-actions">
                    @if (booking.status === 'confirmed') {
                      <button class="action-btn download" (click)="downloadTicket(booking.bookingId)">
                        <mat-icon>download</mat-icon>
                        Ticket
                      </button>
                      <button class="action-btn cancel" 
                              [disabled]="!canCancel(booking)" 
                              (click)="cancelBooking(booking.bookingId)">
                        <mat-icon>close</mat-icon>
                        Cancel
                      </button>
                    }
                  </div>
                  @if (booking.status === 'confirmed' && !canCancel(booking)) {
                    <div class="cancel-warning">
                      <mat-icon>info</mat-icon>
                      Cancellation window is closed
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-page {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);

      h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 4px 0; color: var(--text-main); }
      p { color: var(--text-muted); margin: 0; font-size: 0.92rem; }
    }

    .gradient-text {
      color: var(--primary-red);
    }

    .new-booking-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 10px 20px;
      background: var(--primary-red);
      color: white;
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.88rem;
      text-decoration: none;
      transition: all var(--transition-base);
      box-shadow: 0 2px 10px rgba(225,29,72,0.2);

      &:hover {
        background: var(--primary-red-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(225,29,72,0.3);
        color: white;
      }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: var(--space-3xl) 0;
    }

    .empty-state {
      text-align: center;
      padding: var(--space-3xl);
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
    }
    .empty-icon {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-lg);
      mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--text-muted); }
    }
    .empty-state h3 { font-size: 1.4rem; margin: 0 0 var(--space-sm) 0; color: var(--text-main); }
    .empty-state p { color: var(--text-secondary); margin: 0 0 var(--space-xl) 0; }

    .primary-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 12px 28px;
      background: var(--primary-red);
      color: white;
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-weight: 600;
      text-decoration: none;
      transition: all var(--transition-base);
      box-shadow: 0 2px 10px rgba(225,29,72,0.2);
      &:hover { transform: translateY(-2px); color: white; background: var(--primary-red-hover); }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    /* Booking Card */
    .bookings-list { display: flex; flex-direction: column; gap: 16px; }

    .booking-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.25s ease;

      &:hover {
        box-shadow: var(--shadow-md);
        border-color: rgba(0,0,0,0.12);
        transform: translateY(-1px);
      }
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: var(--space-md);
    }

    .route-info {
      display: flex;
      align-items: center;
      gap: var(--space-sm);

      .city {
        font-family: var(--font-display);
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .arrow {
        font-size: 18px; width: 18px; height: 18px;
        color: var(--text-muted);
      }
    }

    .status-area {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .booking-ref {
      font-family: 'SF Mono', Menlo, monospace;
      font-size: 0.78rem;
      color: var(--text-muted);
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .status-badge {
      font-family: var(--font-display);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 4px 12px;
      border-radius: var(--radius-full);
    }
    .status-badge.confirmed {
      background: rgba(5,150,105,0.1);
      color: #059669;
    }
    .status-badge.cancelled {
      background: rgba(225,29,72,0.08);
      color: #e11d48;
    }
    .status-badge.pending {
      background: rgba(245,158,11,0.1);
      color: #d97706;
    }

    .card-body {
      padding: var(--space-lg);
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
    }

    .detail {
      display: flex;
      align-items: flex-start;
      gap: var(--space-sm);

      mat-icon {
        font-size: 18px; width: 18px; height: 18px;
        color: var(--primary-red);
        margin-top: 3px;
        opacity: 0.7;
      }

      div { display: flex; flex-direction: column; }
      .label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
      .value { font-weight: 500; font-size: 0.9rem; color: var(--text-main); }
      .teal { color: var(--accent-cyan); font-family: 'SF Mono', Menlo, monospace; font-size: 0.85rem; }
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-lg);
      background: #f8fafc;
      border-top: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: var(--space-md);
    }

    .fare-display {
      display: flex;
      align-items: baseline;
      gap: var(--space-sm);
    }
    .fare-label { font-size: 0.8rem; color: var(--text-muted); }
    .fare-amount {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .card-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 14px;
      border: 1px solid var(--border-color);
      background: transparent;
      border-radius: 8px;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;

      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    .action-btn.download {
      color: var(--accent-cyan);
      border-color: rgba(8,145,178,0.2);
      &:hover { background: rgba(8,145,178,0.08); }
    }
    .action-btn.cancel {
      color: #e11d48;
      border-color: rgba(225,29,72,0.15);
      &:hover:not(:disabled) { background: rgba(225,29,72,0.06); }
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        color: var(--text-muted);
        border-color: var(--border-color);
      }
    }

    .card-actions-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
    }

    .cancel-warning {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: var(--space-md); }
      .card-top { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog); // Will use later for confirmation dialog if needed

  bookings: Booking[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getUserBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'primary';
      case 'cancelled': return 'warn';
      case 'pending': return 'accent';
      default: return '';
    }
  }

  getPassengerNames(booking: Booking): string {
    if (!booking.passengers || booking.passengers.length === 0) return 'N/A';
    if (booking.passengers.length === 1) return booking.passengers[0].name;
    return `${booking.passengers[0].name} +${booking.passengers.length - 1}`;
  }

  getSeatNumbers(booking: Booking): string {
    if (!booking.passengers) return 'N/A';
    return booking.passengers.map(p => p.seatNumber).join(', ');
  }

  canCancel(booking: Booking): boolean {
    if (!booking.trip || !booking.trip.departureTime) return false;
    const depTime = new Date(booking.trip.departureTime);
    const now = new Date();
    const hoursDiff = (depTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 2; // Redbus style: close window 2 hours before departure
  }

  cancelBooking(id: number) {
    const dialogRef = this.dialog.open(CancellationDialogComponent, {
      data: { bookingId: id },
      width: '450px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.bookingService.cancelBooking(id).subscribe({
          next: () => {
            this.toastr.success('Booking cancelled successfully. Refund processed.');
            this.loadBookings();
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Failed to cancel booking');
          }
        });
      }
    });
  }

  downloadTicket(id: number) {
    this.bookingService.downloadTicket(id).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) return;

        const fileName = this.getTicketFileName(response.headers.get('content-disposition'), id);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        this.toastr.success('Ticket downloaded');
      }
    });
  }

  private getTicketFileName(contentDisposition: string | null, id: number): string {
    const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
    return match?.[1] ?? `ticket-${id}.pdf`;
  }
}
