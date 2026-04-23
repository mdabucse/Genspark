import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatProgressSpinnerModule],
  template: `
    <div class="page-bg">
      <div class="success-container">
        
        @if (isLoading) {
          <div class="loading-state">
            <mat-spinner diameter="44"></mat-spinner>
          </div>
        } @else if (booking) {
          <!-- Header -->
          <div class="success-header">
            <div class="check-box">
              <mat-icon>check</mat-icon>
            </div>
            <h1>Booking Confirmed</h1>
            <p>A confirmation email has been sent to your registered address.</p>
          </div>

          <!-- Ticket Card -->
          <div class="ticket-wrapper">
            <div class="ticket-cutout left"></div>
            <div class="ticket-cutout right"></div>
            
            <div class="ticket-card">
              
              <!-- Top Section -->
              <div class="ticket-section">
                <div class="flex-row split">
                  <div class="info-block">
                    <span class="label">BOOKING ID</span>
                    <span class="value red-text">{{ booking.bookingRef }}</span>
                  </div>
                  <div class="info-block align-right">
                    <span class="label">STATUS</span>
                    <span class="status-pill">Confirmed</span>
                  </div>
                </div>

                <div class="flex-row split mt-lg">
                  <div class="info-block">
                    <span class="label">From</span>
                    <span class="value-bold">{{ booking.trip?.source }}</span>
                    <span class="value-sub">Central Bus Terminal</span>
                  </div>
                  <div class="info-block">
                    <span class="label">To</span>
                    <span class="value-bold">{{ booking.trip?.destination }}</span>
                    <span class="value-sub">Main Station</span>
                  </div>
                </div>

                <div class="flex-row split mt-lg">
                  <div class="info-block">
                    <span class="label">Date & Time</span>
                    <span class="value-bold">
                      <mat-icon class="sm-icon">event</mat-icon>
                      {{ booking.trip?.departureTime | date:'mediumDate' }}
                    </span>
                    <span class="value-sub">
                      <mat-icon class="sm-icon">schedule</mat-icon>
                      {{ booking.trip?.departureTime | date:'shortTime' }}
                    </span>
                  </div>
                  <div class="info-block">
                    <span class="label">Duration</span>
                    <span class="value-bold">
                      <mat-icon class="sm-icon">timer</mat-icon>
                      {{ getDuration(booking.trip?.departureTime, booking.trip?.arrivalTime) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Middle Section -->
              <div class="ticket-section border-top">
                <div class="flex-row triple">
                  <div class="info-block">
                    <span class="label">Passenger(s)</span>
                    @for (pax of booking.passengers; track pax.name) {
                      <span class="value-bold">{{ pax.name }}</span>
                    }
                  </div>
                  <div class="info-block">
                    <span class="label">Seat(s)</span>
                    <span class="value-bold">{{ getSeats() }}</span>
                  </div>
                  <div class="info-block">
                    <span class="label">Operator</span>
                    <span class="value-bold">{{ booking.trip?.busName }}</span>
                  </div>
                </div>
              </div>

              <!-- Bottom Section -->
              <div class="ticket-section border-dashed bottom-section">
                <div class="flex-row split items-center">
                  <div class="qr-block">
                    <div class="qr-placeholder">
                      <mat-icon>qr_code_2</mat-icon>
                    </div>
                    <div class="qr-text">
                      <span class="value-bold">Scan to Board</span>
                      <span class="value-sub">Show this code to the bus conductor upon boarding.</span>
                    </div>
                  </div>
                  <div class="total-block">
                    <span class="label">Total Paid</span>
                    <span class="value red-text large">₹{{ booking.totalFare }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Actions -->
          <div class="actions-row">
            <button class="btn-primary" (click)="downloadTicket()">
              <mat-icon>download</mat-icon> Download Ticket
            </button>
            <button class="btn-outline">
              <mat-icon>print</mat-icon> Print Ticket
            </button>
            <a routerLink="/" class="btn-grey">
              <mat-icon>add</mat-icon> Book Another Trip
            </a>
          </div>

          <!-- Info Alert -->
          <div class="info-alert">
            <mat-icon>info</mat-icon>
            <div class="alert-content">
              <h4>Boarding Instructions</h4>
              <p>Please arrive at the terminal at least 30 minutes before departure. A valid photo ID is required along with this ticket for boarding.</p>
            </div>
          </div>

        }
      </div>
    </div>
  `,
  styles: [`
    .page-bg {
      background: var(--bg-light);
      min-height: calc(100vh - var(--header-height));
      padding: var(--space-3xl) var(--space-lg);
      display: flex;
      justify-content: center;
    }

    .success-container {
      max-width: 700px;
      width: 100%;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 100px 0;
    }

    .success-header {
      text-align: center;
      margin-bottom: var(--space-2xl);

      .check-box {
        width: 64px; height: 64px;
        background: #dcfce7;
        border-radius: var(--radius-md);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto var(--space-lg);
        mat-icon { font-size: 32px; width: 32px; height: 32px; color: var(--success-green); }
      }

      h1 { font-size: 2rem; font-weight: 700; margin: 0 0 8px 0; }
      p { color: var(--text-secondary); margin: 0; }
    }

    /* Ticket Card */
    .ticket-wrapper {
      position: relative;
      margin-bottom: var(--space-2xl);
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.05));
    }

    .ticket-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .ticket-cutout {
      position: absolute;
      width: 30px; height: 30px;
      background: var(--bg-light);
      border-radius: 50%;
      top: calc(100% - 120px - 15px); /* Positioned exactly on the dashed line */
      z-index: 2;

      &.left { left: -15px; }
      &.right { right: -15px; }
    }

    .ticket-section {
      padding: var(--space-xl) var(--space-2xl);

      &.border-top { border-top: 1px dashed var(--border-color); }
      &.border-dashed { border-top: 2px dashed var(--border-color); }
      &.bottom-section { height: 120px; display: flex; align-items: center; background: #fafafa; }
    }

    /* Typographic Blocks */
    .flex-row { display: flex; }
    .split { justify-content: space-between; }
    .triple { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-md); }
    .items-center { align-items: center; width: 100%; }
    .mt-lg { margin-top: var(--space-xl); }

    .info-block {
      display: flex; flex-direction: column; gap: 4px;
      &.align-right { align-items: flex-end; }
    }

    .label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 1rem; font-weight: 500; color: var(--text-main); }
    .value-bold { font-size: 1rem; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 4px; }
    .value-sub { font-size: 0.85rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; }
    .red-text { color: var(--primary-red); }
    .large { font-size: 1.4rem; }

    .sm-icon { font-size: 16px; width: 16px; height: 16px; color: var(--text-muted); }

    .status-pill {
      background: var(--success-green-dim);
      color: var(--success-green);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .qr-block {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }
    .qr-placeholder {
      width: 64px; height: 64px;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--text-main); }
    }
    .qr-text { display: flex; flex-direction: column; max-width: 200px; }

    .total-block { text-align: right; display: flex; flex-direction: column; gap: 4px; }

    /* Actions */
    .actions-row {
      display: flex;
      justify-content: center;
      gap: var(--space-md);
      margin-bottom: var(--space-2xl);
    }

    .btn-grey {
      background: #f3f4f6;
      color: var(--text-main);
      border: none;
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-weight: 500;
      display: inline-flex; align-items: center; gap: 8px;
      cursor: pointer; transition: background 0.2s;
      text-decoration: none;
      &:hover { background: #e5e7eb; }
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }
    
    ::ng-deep .btn-primary mat-icon, ::ng-deep .btn-outline mat-icon { font-size: 20px; width: 20px; height: 20px; }

    /* Info Alert */
    .info-alert {
      display: flex;
      gap: var(--space-md);
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      
      mat-icon { color: #3b82f6; }
      
      .alert-content {
        h4 { margin: 0 0 4px 0; color: #1e3a8a; font-size: 0.95rem; }
        p { margin: 0; color: #1e40af; font-size: 0.85rem; line-height: 1.5; }
      }
    }

    @media (max-width: 600px) {
      .ticket-section { padding: var(--space-md); }
      .triple { grid-template-columns: 1fr; }
      .actions-row { flex-direction: column; }
      .btn-primary, .btn-outline, .btn-grey { width: 100%; justify-content: center; }
      .ticket-cutout { display: none; }
      .bottom-section .flex-row { flex-direction: column; gap: var(--space-md); align-items: flex-start; }
      .total-block { text-align: left; }
    }
  `]
})
export class BookingSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);

  bookingIdStr = '';
  booking: any;
  isLoading = true;

  ngOnInit() {
    this.bookingIdStr = this.route.snapshot.paramMap.get('bookingId') || '';
    if (this.bookingIdStr) {
      this.loadBooking(Number(this.bookingIdStr));
    }
  }

  loadBooking(id: number) {
    this.bookingService.getBookingDetails(id).subscribe({
      next: (res) => {
        this.booking = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getDuration(start: any, end: any): string {
    if (!start || !end) return '';
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = (e - s) / 1000;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m`;
  }

  getSeats(): string {
    if (!this.booking || !this.booking.passengers) return '';
    return this.booking.passengers.map((p: any) => p.seatNumber).join(', ');
  }

  downloadTicket() {
    if (!this.booking?.bookingId) return;

    this.bookingService.downloadTicket(this.booking.bookingId).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.booking.bookingRef}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        this.toastr.success('Ticket downloaded');
      }
    });
  }
}
