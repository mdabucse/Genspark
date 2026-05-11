import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService } from '../../../core/services/booking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="payment-page">
      <!-- Progress Steps -->
      <div class="progress-bar animate-fade-in-up">
        <div class="step completed">
          <div class="step-circle"><mat-icon>check</mat-icon></div>
          <span>Seats</span>
        </div>
        <div class="step-line completed"></div>
        <div class="step completed">
          <div class="step-circle"><mat-icon>check</mat-icon></div>
          <span>Passengers</span>
        </div>
        <div class="step-line completed"></div>
        <div class="step active">
          <div class="step-circle">3</div>
          <span>Payment</span>
        </div>
      </div>

      @if (isLoading) {
        <div class="loading-state">
          <mat-spinner diameter="44"></mat-spinner>
          <p>Loading payment details...</p>
        </div>
      } @else if (booking) {
        <div class="payment-layout">
          <!-- Left: Trip Summary -->
          <div class="trip-summary animate-fade-in-up">
            <div class="summary-card">
              <h3>Trip Summary</h3>
              <div class="route-visual">
                <div class="point">
                  <div class="dot start"></div>
                  <span class="city-name">{{ booking.trip?.source }}</span>
                </div>
                <div class="route-connector">
                  <div class="dashed-line"></div>
                </div>
                <div class="point">
                  <div class="dot end"></div>
                  <span class="city-name">{{ booking.trip?.destination }}</span>
                </div>
              </div>

              <div class="trip-details">
                <div class="detail-row">
                  <mat-icon>event</mat-icon>
                  <div>
                    <span class="label">Departure</span>
                    <span class="value">{{ booking.trip?.departureTime | date:'medium' }}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <mat-icon>directions_bus</mat-icon>
                  <div>
                    <span class="label">Bus</span>
                    <span class="value">{{ booking.trip?.busName }} ({{ booking.trip?.busType }})</span>
                  </div>
                </div>
                <div class="detail-row">
                  <mat-icon>group</mat-icon>
                  <div>
                    <span class="label">Passengers</span>
                    <span class="value">{{ booking.passengers.length }} traveler(s)</span>
                  </div>
                </div>
                <div class="detail-row">
                  <mat-icon>confirmation_number</mat-icon>
                  <div>
                    <span class="label">Booking Ref</span>
                    <span class="value mono">{{ booking.bookingRef }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Payment -->
          <div class="payment-form animate-fade-in-up stagger-2">
            <div class="payment-card">
              <h3>Payment</h3>

              <!-- Fare Breakdown -->
              <div class="fare-section">
                <div class="fare-row">
                  <span>Passengers</span>
                  <span>{{ booking.passengers.length }}</span>
                </div>
                <div class="fare-divider"></div>
                <div class="fare-row total">
                  <span>Total Amount</span>
                  <span class="total-amount">₹{{ booking.totalFare }}</span>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="method-section">
                <h4>Payment Method</h4>
                <div class="method-card selected">
                  <div class="method-left">
                    <mat-icon>credit_card</mat-icon>
                    <div>
                      <span class="method-name">Credit / Debit Card</span>
                      <span class="method-sub">Sandbox Mode</span>
                    </div>
                  </div>
                  <mat-icon class="check-icon">check_circle</mat-icon>
                </div>
              </div>

              <!-- Security Badge -->
              <div class="security-badge">
                <mat-icon>shield</mat-icon>
                <span>Your payment is secured with 256-bit encryption</span>
              </div>

              <!-- Actions -->
              <div class="payment-actions">
                <button class="cancel-btn" (click)="cancel()">
                  Cancel
                </button>
                <button class="pay-btn" (click)="processPayment()" [disabled]="isProcessing">
                  @if (isProcessing) {
                    <div class="btn-loader"></div>
                    <span>Processing...</span>
                  } @else {
                    <mat-icon>lock</mat-icon>
                    <span>Pay ₹{{ booking.totalFare }}</span>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .payment-page {
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: 16px;
      p { color: var(--text-muted); font-size: 0.95rem; }
    }

    .payment-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .summary-card, .payment-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 24px;
      box-shadow: var(--shadow-sm);

      h3 {
        font-family: var(--font-display);
        font-size: 0.8rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        color: var(--text-muted);
        margin: 0 0 24px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        &::before { content: ''; width: 4px; height: 16px; background: var(--primary-red); border-radius: 4px; }
      }
    }

    /* Route Visual */
    .route-visual {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .point {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .dot.start { background: var(--primary-red); box-shadow: 0 0 10px rgba(225,29,72,0.3); }
    .dot.end { background: #cbd5e1; }

    .city-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-main);
    }

    .route-connector {
      flex: 1;
      .dashed-line {
        height: 2px;
        border-bottom: 2px dashed #e2e8f0;
      }
    }

    /* Trip Details */
    .trip-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 14px;

      mat-icon {
        font-size: 20px; width: 20px; height: 20px;
        color: var(--primary-red);
        opacity: 0.8;
      }

      div {
        display: flex;
        flex-direction: column;
      }

      .label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .value {
        color: var(--text-main);
        font-weight: 700;
        font-size: 0.95rem;
      }
      .mono {
        font-family: 'SF Mono', Menlo, monospace;
        color: var(--primary-red);
        font-size: 0.85rem;
      }
    }

    /* Fare */
    .fare-section {
      margin-bottom: 24px;
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
    }
    .fare-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 600;
    }
    .fare-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 12px 0;
    }
    .fare-row.total {
      padding-top: 4px;
      span { font-weight: 800; color: var(--text-main); font-size: 1rem; }
    }
    .total-amount {
      font-family: var(--font-display);
      font-size: 1.4rem !important;
      font-weight: 800 !important;
      color: var(--primary-red) !important;
    }

    /* Method */
    .method-section {
      margin-bottom: 24px;
      h4 {
        font-family: var(--font-display);
        font-size: 0.85rem;
        font-weight: 700;
        margin: 0 0 12px 0;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .method-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: white;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      &.selected {
        border-color: var(--primary-red);
        background: #fff1f2;
        box-shadow: 0 4px 12px rgba(225,29,72,0.1);
      }
    }

    .method-left {
      display: flex;
      align-items: center;
      gap: 12px;

      mat-icon {
        font-size: 24px; width: 24px; height: 24px;
        color: var(--primary-red);
      }

      .method-name {
        font-weight: 700;
        color: var(--text-main);
        display: block;
      }
      .method-sub {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-weight: 600;
      }
    }

    .check-icon {
      color: var(--primary-red) !important;
      font-size: 22px !important;
      width: 22px !important;
      height: 22px !important;
    }

    /* Security */
    .security-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      margin-bottom: 24px;

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: #16a34a; }
      span { font-size: 0.78rem; color: #15803d; font-weight: 600; }
    }

    /* Actions */
    .payment-actions {
      display: flex;
      gap: 12px;
    }

    .cancel-btn {
      flex: 0 0 auto;
      padding: 12px 24px;
      background: white;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { background: #f8fafc; color: var(--text-main); border-color: #cbd5e1; }
    }

    .pay-btn {
      flex: 1;
      height: 52px;
      border: none;
      border-radius: var(--radius-full);
      background: var(--primary-red);
      color: #ffffff;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 14px rgba(225,29,72,0.25);

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(225,29,72,0.35);
        background: var(--primary-red-hover);
      }
      &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .btn-loader {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spinSlow 0.8s linear infinite;
    }
  `]
})
export class PaymentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);

  bookingId!: number;
  booking: any;
  isLoading = true;
  isProcessing = false;

  ngOnInit() {
    this.bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    this.loadBooking();
  }

  loadBooking() {
    this.bookingService.getBookingDetails(this.bookingId).subscribe({
      next: (res) => {
        this.booking = res;
        this.isLoading = false;

        if (this.booking.status !== 'pending') {
          this.toastr.warning('This booking is already processed or cancelled.');
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });
  }

  processPayment() {
    this.isProcessing = true;
    this.bookingService.dummyPay(this.bookingId).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.router.navigate(['/booking/success', this.bookingId]);
      },
      error: () => {
        this.isProcessing = false;
      }
    });
  }

  cancel() {
    if (confirm('Are you sure you want to cancel this booking process?')) {
      this.bookingService.cancelBooking(this.bookingId).subscribe({
        next: () => {
          this.toastr.info('Booking cancelled.');
          this.router.navigate(['/']);
        }
      });
    }
  }
}
