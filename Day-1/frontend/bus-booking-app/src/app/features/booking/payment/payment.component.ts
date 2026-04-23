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
      max-width: var(--max-content);
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: var(--space-lg);
      p { color: var(--text-secondary); }
    }

    .payment-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-xl);
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .summary-card, .payment-card {
      background: var(--surface-card, #ffffff);
      border: 1px solid var(--glass-border, #e5e7eb);
      border-radius: var(--radius-xl, 12px);
      padding: var(--space-xl);

      h3 {
        font-family: var(--font-display, inherit);
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: var(--text-secondary, #6b7280);
        margin: 0 0 var(--space-xl) 0;
      }
    }

    // Route Visual
    .route-visual {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg) 0;
      margin-bottom: var(--space-lg);
      border-bottom: 1px solid var(--glass-border);
    }

    .point {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .dot {
      width: 12px; height: 12px;
      border-radius: 50%;
    }
    .dot.start { background: var(--primary-red, #e53935); box-shadow: 0 0 8px rgba(229,57,53,0.4); }
    .dot.end { background: var(--text-muted, #9ca3af); box-shadow: 0 0 8px rgba(156,163,175,0.4); }

    .city-name {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 1.1rem;
    }

    .route-connector {
      flex: 1;
      .dashed-line {
        height: 2px;
        border-bottom: 2px dashed var(--border-color, #e5e7eb);
      }
    }

    // Trip Details
    .trip-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: var(--space-md);

      mat-icon {
        font-size: 20px; width: 20px; height: 20px;
        color: var(--primary-red, #e53935);
        margin-top: 2px;
      }

      div {
        display: flex;
        flex-direction: column;
      }

      .label {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 2px;
      }
      .value {
        color: var(--text-main, #1f2937);
        font-weight: 500;
      }
      .mono {
        font-family: var(--font-mono, monospace);
        letter-spacing: 1px;
        color: var(--primary-red, #e53935);
      }
    }

    // Fare
    .fare-section {
      margin-bottom: var(--space-xl);
    }
    .fare-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-sm) 0;
      color: var(--text-secondary);
    }
    .fare-divider {
      height: 1px;
      background: var(--glass-border);
      margin: var(--space-sm) 0;
    }
    .fare-row.total {
      padding-top: var(--space-md);
      span { font-weight: 600; color: var(--text-primary); }
    }
    .total-amount {
      font-family: var(--font-display, inherit);
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      color: var(--primary-red, #e53935) !important;
    }

    // Method
    .method-section {
      margin-bottom: var(--space-xl);
      h4 {
        font-family: var(--font-display);
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0 0 var(--space-md) 0;
        color: var(--text-secondary);
      }
    }

    .method-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-md);
      background: var(--bg-light, #f9fafb);
      border: 2px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;

      &.selected {
        border-color: var(--primary-red, #e53935);
        background: rgba(229, 57, 53, 0.04);
      }
    }

    .method-left {
      display: flex;
      align-items: center;
      gap: var(--space-md);

      mat-icon {
        font-size: 24px; width: 24px; height: 24px;
        color: var(--primary-red, #e53935);
      }

      .method-name {
        font-weight: 600;
        display: block;
      }
      .method-sub {
        font-size: 0.8rem;
        color: var(--text-muted, #9ca3af);
      }
    }

    .check-icon {
      color: var(--primary-red, #e53935) !important;
      font-size: 22px !important;
      width: 22px !important;
      height: 22px !important;
    }

    // Security
    .security-badge {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: var(--radius-md);
      margin-bottom: var(--space-xl);

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: #16a34a; }
      span { font-size: 0.8rem; color: #15803d; }
    }

    // Actions
    .payment-actions {
      display: flex;
      gap: var(--space-md);
    }

    .cancel-btn {
      flex: 0 0 auto;
      padding: 12px 24px;
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      font-family: var(--font-display);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
      &:hover { border-color: var(--danger); color: var(--danger); }
    }

    .pay-btn {
      flex: 1;
      height: 52px;
      border: none;
      border-radius: var(--radius-md);
      background: var(--primary-red, #e53935);
      color: #ffffff;
      font-family: var(--font-display, inherit);
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(229, 57, 53, 0.4);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(229, 57, 53, 0.55);
        background: var(--primary-red-hover, #c62828);
      }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .btn-loader {
      width: 18px; height: 18px;
      border: 2px solid transparent;
      border-top-color: #ffffff;
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
