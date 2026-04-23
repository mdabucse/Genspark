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

    // Progress Bar
    .progress-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: var(--space-2xl);
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;

      span {
        font-family: var(--font-display);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .step-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--text-muted);
      background: var(--surface-card);
    }

    .step.completed .step-circle {
      background: var(--success);
      border-color: var(--success);
      color: white;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .step.completed span { color: var(--success); }

    .step.active .step-circle {
      background: var(--accent-teal);
      border-color: var(--accent-teal);
      color: var(--text-on-accent);
      box-shadow: 0 0 16px var(--accent-teal-glow);
    }
    .step.active span { color: var(--accent-teal); }

    .step-line {
      width: 60px;
      height: 2px;
      background: var(--glass-border);
      margin: 0 var(--space-sm);
      margin-bottom: 22px;
    }
    .step-line.completed { background: var(--success); }

    // Header
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);

      h1 {
        font-size: 1.6rem;
        font-weight: 700;
        margin: 0 0 4px 0;
      }
      p { color: var(--text-secondary); margin: 0; }
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--accent-teal), var(--accent-amber));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .timer-badge {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 8px 16px;
      background: var(--surface-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--text-muted); }
    }

    .timer-value {
      font-family: var(--font-mono);
      font-weight: 600;
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .timer-value.urgent {
      color: var(--danger);
      animation: pulse 1s infinite;
    }

    // Passenger Card
    .passenger-card {
      background: var(--surface-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      margin-bottom: var(--space-md);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .pax-badge {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-family: var(--font-display);
      font-weight: 600;
      color: var(--text-primary);
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--accent-teal); }
    }

    .seat-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      background: var(--accent-teal-dim);
      color: var(--accent-teal);
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 600;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    .form-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: var(--space-md);

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .contact-details {
      background: var(--surface-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      margin-bottom: var(--space-md);
      
      h3 {
        margin-top: 0;
        margin-bottom: var(--space-md);
        font-family: var(--font-display);
        font-size: 1.1rem;
        color: var(--text-primary);
      }
    }

    .input-group { }

    .input-label {
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: block;
      margin-bottom: 4px;
    }

    .full-width { width: 100%; }

    // Actions
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-xl);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--border-color, #e5e7eb);
      background: transparent;
    }

    .cancel-btn {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 10px 20px;
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      font-family: var(--font-display);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);

      &:hover {
        border-color: var(--text-muted);
        color: var(--text-primary);
      }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .submit-btn {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 12px 28px;
      background: var(--primary-red, #e53935);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md, 6px);
      font-family: var(--font-display, inherit);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
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
      border-top-color: var(--text-on-accent);
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
