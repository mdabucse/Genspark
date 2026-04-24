import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  template: `
    <div class="passenger-page">
      <!-- Progress Steps -->
      <div class="progress-bar animate-fade-in-up">
        <div class="step completed">
          <div class="step-circle"><mat-icon>check</mat-icon></div>
          <span>Seats</span>
        </div>
        <div class="step-line completed"></div>
        <div class="step active">
          <div class="step-circle">2</div>
          <span>Passengers</span>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div class="step-circle">3</div>
          <span>Payment</span>
        </div>
      </div>

      <!-- Header with Timer -->
      <div class="page-header animate-fade-in-up stagger-1">
        <div>
          <h1>Passenger <span class="gradient-text">Details</span></h1>
          <p>Enter details for each passenger</p>
        </div>
        <div class="timer-badge">
          <mat-icon>timer</mat-icon>
          <span class="timer-value" [class.urgent]="timeLeft < 60">{{ timeLeftStr }}</span>
        </div>
      </div>

      <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
        <div formArrayName="passengers">
          @for (passenger of passengers.controls; track i; let i = $index) {
            <div class="passenger-card animate-fade-in-up" [style.animation-delay]="(i * 0.1 + 0.2) + 's'" [formGroupName]="i">
              <div class="card-header">
                <div class="pax-badge">
                  <mat-icon>person</mat-icon>
                  <span>Passenger {{ i + 1 }}</span>
                </div>
                <div class="seat-badge">
                  <mat-icon>event_seat</mat-icon>
                  Seat {{ selectedSeats[i].seatNumber }}
                </div>
              </div>
              <div class="form-grid">
                <div class="input-group">
                  <label class="input-label">Full Name</label>
                  <mat-form-field appearance="outline" class="full-width">
                    <input matInput formControlName="name" placeholder="As on ID proof">
                  </mat-form-field>
                </div>
                <div class="input-group">
                  <label class="input-label">Age</label>
                  <mat-form-field appearance="outline" class="full-width">
                    <input matInput type="number" formControlName="age" placeholder="e.g. 25">
                  </mat-form-field>
                </div>
                <div class="input-group">
                  <label class="input-label">Gender</label>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-select formControlName="gender">
                      <mat-option value="M">Male</mat-option>
                      <mat-option value="F">Female</mat-option>
                      <mat-option value="O">Other</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="contact-details animate-fade-in-up stagger-3">
          <h3>Contact Details</h3>
          <div class="input-group">
            <label class="input-label">Email Address for Ticket</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="contactEmail" type="email" placeholder="e.g. passenger@example.com">
            </mat-form-field>
          </div>
        </div>

        <div class="form-actions animate-fade-in-up stagger-4">
          <button type="button" class="cancel-btn" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back to Seats
          </button>
          <button type="submit" class="submit-btn" [disabled]="bookingForm.invalid || isSubmitting">
            @if (isSubmitting) {
              <div class="btn-loader"></div>
              <span>Processing...</span>
            } @else {
              <span>Proceed to Payment</span>
              <mat-icon>arrow_forward</mat-icon>
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .passenger-page {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
      padding-bottom: 60px;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);

      h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 4px 0; color: var(--text-main); }
      p { color: var(--text-muted); margin: 0; font-size: 0.92rem; }
    }

    .gradient-text { color: var(--primary-red); }

    .timer-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-sm);

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--text-muted); }
    }

    .timer-value {
      font-family: 'SF Mono', Menlo, monospace;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text-main);
    }
    .timer-value.urgent {
      color: #e11d48;
      animation: pulse 1s infinite;
    }

    /* Passenger Card */
    .passenger-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: var(--space-lg);
      margin-bottom: var(--space-md);
      transition: all 0.2s;
      &:hover { border-color: rgba(0,0,0,0.12); box-shadow: var(--shadow-sm); }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px dashed var(--border-color);
    }

    .pax-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-display);
      font-weight: 700;
      color: var(--text-main);
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--primary-red); opacity: 0.8; }
    }

    .seat-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 14px;
      background: #f1f5f9;
      color: var(--text-main);
      border-radius: 8px;
      font-family: var(--font-display);
      font-size: 0.82rem;
      font-weight: 700;
      mat-icon { font-size: 15px; width: 15px; height: 15px; color: var(--primary-red); }
    }

    .form-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .contact-details {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: var(--space-lg);
      margin-top: 24px;
      margin-bottom: var(--space-md);
      
      h3 {
        margin-top: 0;
        margin-bottom: 16px;
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .input-label {
      font-family: var(--font-display);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      display: block;
      margin-bottom: 6px;
    }

    .full-width { width: 100%; }

    /* Actions */
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }

    .cancel-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      background: white;
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .submit-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 32px;
      background: var(--primary-red);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.92rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(225,29,72,0.2);

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(225,29,72,0.3);
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
export class PassengerFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);

  tripId!: number;
  selectedSeats: any[] = [];
  bookingForm!: FormGroup;
  isSubmitting = false;

  // Timer logic for 5 min lock
  timeLeft = 300; // 5 minutes in seconds
  timerInterval: any;

  ngOnInit() {
    this.tripId = Number(this.route.snapshot.paramMap.get('tripId'));
    const seatsData = sessionStorage.getItem('selectedSeats');

    if (!seatsData) {
      this.toastr.error('Session expired. Please select seats again.');
      this.router.navigate(['/booking', this.tripId]);
      return;
    }

    this.selectedSeats = JSON.parse(seatsData);
    this.initForm();
    this.startTimer();
  }

  initForm() {
    const userEmail = localStorage.getItem('email') || '';
    this.bookingForm = this.fb.group({
      contactEmail: [userEmail, [Validators.required, Validators.email]],
      passengers: this.fb.array([])
    });

    this.selectedSeats.forEach(seat => {
      this.passengers.push(this.fb.group({
        seatId: [seat.seatId],
        name: ['', Validators.required],
        age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
        gender: ['', Validators.required]
      }));
    });
  }

  get passengers() {
    return this.bookingForm.get('passengers') as FormArray;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.toastr.error('Session expired. Seat lock released.');
        sessionStorage.removeItem('selectedSeats');
        this.router.navigate(['/booking', this.tripId]);
      }
    }, 1000);
  }

  get timeLeftStr() {
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  goBack() {
    clearInterval(this.timerInterval);
    sessionStorage.removeItem('selectedSeats');
    this.router.navigate(['/booking', this.tripId]);
  }

  onSubmit() {
    if (this.bookingForm.invalid) return;

    this.isSubmitting = true;
    clearInterval(this.timerInterval);

    const payload = {
      tripId: this.tripId,
      contactEmail: this.bookingForm.value.contactEmail,
      passengers: this.bookingForm.value.passengers
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (res) => {
        // Clear seats from session
        sessionStorage.removeItem('selectedSeats');
        // Navigate to payment
        this.router.navigate(['/payment', res.bookingId]);
      },
      error: () => {
        this.isSubmitting = false;
        // If error is lock expired, we should go back
        this.startTimer(); // Restart timer just in case it wasn't expired
      }
    });
  }
}
