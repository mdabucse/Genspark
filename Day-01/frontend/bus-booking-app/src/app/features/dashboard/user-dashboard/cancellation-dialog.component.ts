import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService, CancellationQuote } from '../../../core/services/booking.service';

@Component({
  selector: 'app-cancellation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="cancel-dialog">
      <h2 mat-dialog-title>
        <mat-icon color="warn">warning</mat-icon>
        Cancel Booking
      </h2>

      <mat-dialog-content>
        @if (isLoading) {
          <div class="loading-state">
            <mat-spinner diameter="32"></mat-spinner>
            <p>Fetching cancellation details...</p>
          </div>
        } @else if (quote) {
          <div class="quote-container">
            <div class="policy-alert">
              <mat-icon>info</mat-icon>
              <span>{{ quote.cancellationPolicy }}</span>
            </div>

            <div class="quote-summary glass-panel">
              <div class="quote-row">
                <span>Original Amount</span>
                <span>₹{{ quote.totalAmount }}</span>
              </div>
              <div class="quote-row deduction">
                <span>Deduction Fee</span>
                <span>- ₹{{ quote.deductionAmount }}</span>
              </div>
              <div class="divider"></div>
              <div class="quote-row refund">
                <span>Refund Amount</span>
                <span>₹{{ quote.refundAmount }}</span>
              </div>
            </div>

            <div class="info-note">
              <p>* The refund will be credited to your original payment method within 5-7 business days.</p>
            </div>
          </div>
        } @else {
          <div class="error-state">
            <mat-icon>error_outline</mat-icon>
            <p>Unable to retrieve cancellation details. Please try again later.</p>
          </div>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">No, Keep Booking</button>
        <button mat-flat-button color="warn" [disabled]="!quote?.canCancel || isLoading" (click)="onConfirm()">
          Confirm Cancellation
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .cancel-dialog {
      min-width: 320px;
      max-width: 450px;
      background: var(--surface-card);
      color: var(--text-primary);
    }
    
    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-display);
      font-weight: 700;
      margin-bottom: 16px !important;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      gap: 12px;
      p { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }
    }

    .policy-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      background: hsla(38, 100%, 62%, 0.1);
      border: 1px solid hsla(38, 100%, 62%, 0.2);
      padding: 12px;
      border-radius: var(--radius-md);
      color: var(--accent-amber);
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 0.95rem;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .glass-panel {
      background: var(--surface-elevated);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 16px;
    }

    .quote-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 0.95rem;
      color: var(--text-secondary);
      
      &.deduction { color: var(--danger); }
      &.refund {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--success-green);
        margin-top: 10px;
        margin-bottom: 0;
      }
    }

    .divider {
      height: 1px;
      background: var(--glass-border);
      margin: 10px 0;
    }

    .info-note {
      margin-top: 16px;
      p { font-size: 0.75rem; color: var(--text-muted); font-style: italic; margin: 0; }
    }

    .error-state {
      text-align: center;
      padding: 24px 0;
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--danger); margin-bottom: 12px; }
      p { color: var(--text-secondary); }
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
      button { font-family: var(--font-display); font-weight: 600; }
    }
  `]
})
export class CancellationDialogComponent implements OnInit {
  private bookingService = inject(BookingService);
  private dialogRef = inject(MatDialogRef<CancellationDialogComponent>);
  
  quote: CancellationQuote | null = null;
  isLoading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bookingId: number }) {}

  ngOnInit() {
    this.bookingService.getCancellationQuote(this.data.bookingId).subscribe({
      next: (res) => {
        this.quote = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
