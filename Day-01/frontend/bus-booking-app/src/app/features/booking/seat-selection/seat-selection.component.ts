import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TripService } from '../../../core/services/trip.service';
import { BookingService } from '../../../core/services/booking.service';
import { Trip, SeatStatus } from '../../../core/models/trip.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-bg">
      <!-- Progress Steps -->
      <div class="progress-bar animate-fade-in-up">
        <div class="step active">
          <div class="step-circle">1</div>
          <span>Seats</span>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div class="step-circle">2</div>
          <span>Passengers</span>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div class="step-circle">3</div>
          <span>Payment</span>
        </div>
      </div>

      <div class="content-layout">
        <main class="results-main">
          @if (isLoading) {
            <div class="loading-state">
              <mat-spinner diameter="44"></mat-spinner>
            </div>
          } @else if (trip) {
            
            <!-- Expanded Bus Card Header -->
            <div class="expanded-card">
              <div class="bus-card">
                <div class="card-left">
                  <div class="operator-info">
                    <h3 class="bus-name">{{ trip.busName || trip.operatorName }}</h3>
                    <p class="operator-sub">by {{ trip.operatorName }}</p>
                    <p class="bus-type">{{ trip.busType }}</p>
                    <div class="amenities">
                      <mat-icon>wifi</mat-icon>
                      <mat-icon>power</mat-icon>
                      <mat-icon>water_drop</mat-icon>
                    </div>
                  </div>

                  <div class="timeline">
                    <div class="time-block text-right">
                      <span class="time">{{ trip.departureTime | date:'HH:mm' }}</span>
                      <span class="station">{{ trip.source }}</span>
                    </div>
                    
                    <div class="duration-line">
                      <span class="duration-text">{{ getDuration(trip.departureTime, trip.arrivalTime) }}</span>
                      <div class="line">
                        <div class="dot"></div>
                        <div class="dot"></div>
                      </div>
                    </div>

                    <div class="time-block">
                      <span class="time">{{ trip.arrivalTime | date:'HH:mm' }}</span>
                      <span class="station">{{ trip.destination }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-right">
                  <div class="rating-badge">
                    <span class="rating">4.5 <mat-icon>star</mat-icon></span>
                  </div>
                  <div class="price-block">
                    <span class="new-price">₹{{ trip.totalFare }}</span>
                  </div>
                </div>
              </div>

              <!-- Seat Selection Area -->
              <div class="seat-selection-box">
                @if (!hasAvailableSeats()) {
                  <div class="no-seats-state">
                    <mat-icon>event_busy</mat-icon>
                    <h3>No seats available</h3>
                    <p>This bus is currently full. Please choose another bus for this route.</p>
                    <button class="back-btn" (click)="goBackToSearch()">
                      <mat-icon>arrow_back</mat-icon>
                      Back to results
                    </button>
                  </div>
                } @else {
                  <div class="seat-layout-row">
                  
                    <!-- Left/Center: Decks & Legend -->
                    <div class="layout-left">
                      <div class="legend-header">
                        <h3>SELECT SEATS</h3>
                        <div class="legend">
                          <div class="legend-item"><div class="box avail"></div> Available</div>
                          <div class="legend-item"><div class="box booked"></div> Booked</div>
                          <div class="legend-item"><div class="box selected"></div> Selected</div>
                        </div>
                      </div>

                      <div class="decks-container">
                        @if (trip.hasUpperDeck) {
                          <div class="deck-toggle">
                            <button [class.active]="currentDeck === 'lower'" (click)="currentDeck = 'lower'">Lower Deck</button>
                            <button [class.active]="currentDeck === 'upper'" (click)="currentDeck = 'upper'">Upper Deck</button>
                          </div>
                        }

                        <div class="deck-box">
                          <div class="bus-body" [style.grid-template-columns]="'repeat(' + (trip.columns || 4) + ', 1fr)'">
                            @for (seat of getSeatsForDeck(currentDeck); track seat.seatId) {
                              <div 
                                class="seat-container"
                                [style.grid-row]="(seat.row || 0) + 1"
                                [style.grid-column]="(seat.column || 0) + 1"
                                [class.is-sleeper]="seat.seatType === 'sleeper'"
                              >
                                <div 
                                  class="seat-box" 
                                  [ngClass]="getSeatClass(seat)"
                                  [class.sleeper]="seat.seatType === 'sleeper'"
                                  (click)="toggleSeat(seat)"
                                >
                                  @if (seat.seatType === 'sleeper') {
                                    <mat-icon>king_bed</mat-icon>
                                  } @else {
                                    <mat-icon>chair</mat-icon>
                                  }
                                  <span class="seat-label">{{ seat.seatNumber }}</span>
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right: Summary -->
                    <div class="layout-right">
                      <div class="summary-box">
                        <div class="points">
                          <div class="point-row">
                            <span class="point-label">Boarding Point</span>
                            <span class="point-value">{{ trip.pickupPoint || (trip.source + ' Station') }} - {{ trip.departureTime | date:'HH:mm' }}</span>
                          </div>
                          <div class="point-row">
                            <span class="point-label">Dropping Point</span>
                            <span class="point-value">{{ trip.dropPoint || (trip.destination + ' Station') }} - {{ trip.arrivalTime | date:'HH:mm' }}</span>
                          </div>
                        </div>

                        <div class="fare-calc">
                          <div class="fare-row">
                            <span class="f-label">Seat(s)</span>
                            <span class="f-val font-bold">{{ getSelectedSeatNumbers() || 'None' }}</span>
                          </div>
                          <div class="fare-row total-row">
                            <span class="f-label text-red font-bold">Total Amount</span>
                            <span class="f-val total-amt">₹{{ getTotalAmount() }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                }
              </div>
            </div>

            <!-- Floating Next Action -->
            @if (hasAvailableSeats()) {
              <div class="floating-action">
              <div class="trip-quick-info">
                <span class="op">{{ trip.operatorName }}</span>
                <span class="bt">{{ trip.busType }}</span>
              </div>
              <div class="time-quick">
                <span class="time">{{ trip.departureTime | date:'HH:mm' }}</span>
              </div>
              <div class="action-btn-wrapper">
                <button 
                  class="proceed-btn" 
                  [disabled]="selectedSeats.length === 0 || isLocking"
                  (click)="proceedToPassengerForm()"
                >
                  @if (isLocking) {
                    <span>Processing...</span>
                  } @else {
                    Proceed to Book <mat-icon>arrow_forward</mat-icon>
                  }
                </button>
              </div>
            </div>
            }

          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .page-bg {
      background: var(--bg-main);
      min-height: calc(100vh - var(--header-height));
      padding: var(--space-xl) var(--space-lg);
    }

    .content-layout {
      max-width: var(--max-content);
      margin: 0 auto;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: var(--space-3xl);
    }

    // Expanded Card
    .expanded-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 100px;
      box-shadow: var(--shadow-sm);
    }

    .bus-card {
      padding: var(--space-xl);
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
    }

    .card-left {
      display: flex;
      gap: 64px;
      flex: 1;
    }

    .operator-info {
      width: 200px;
      .bus-name { font-size: 1.1rem; font-weight: 700; margin: 0 0 2px 0; color: var(--text-main); }
      .operator-sub { font-size: 0.78rem; color: var(--text-muted); margin: 0 0 6px 0; font-weight: 500; }
      .bus-type { font-size: 0.82rem; color: var(--text-secondary); margin: 0 0 8px 0; font-weight: 500; }
      .amenities { display: flex; gap: 8px; mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--text-muted); } }
    }

    .timeline {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      flex: 1;
      justify-content: center;
    }

    .time-block {
      display: flex;
      flex-direction: column;
      &.text-right { text-align: right; }
      .time { font-size: 1.4rem; font-weight: 700; color: var(--text-main); }
      .station { font-size: 0.85rem; color: var(--text-secondary); }
    }

    .duration-line {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;
      .duration-text { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px; }
      .line {
        width: 100%; height: 1px; background: var(--text-muted); position: relative;
        .dot { position: absolute; top: -2px; width: 5px; height: 5px; border-radius: 50%; background: var(--text-muted); }
        .dot:first-child { left: 0; } .dot:last-child { right: 0; }
      }
    }

    .card-right {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-end;
    }

    .rating-badge .rating {
      background: var(--success-green);
      color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;
      display: flex; align-items: center; gap: 2px;
      mat-icon { font-size: 12px; width: 12px; height: 12px; }
    }

    .price-block .new-price { font-size: 1.6rem; font-weight: 700; color: var(--primary-red); }

    // Seat Layout Area
    .seat-selection-box {
      background: #f8fafc;
      padding: var(--space-xl) var(--space-2xl);
      border-top: 1px solid var(--border-color);
    }

    .no-seats-state {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: var(--space-3xl) var(--space-xl);
      text-align: center;

      mat-icon {
        color: var(--primary-red);
        font-size: 52px;
        width: 52px;
        height: 52px;
        margin-bottom: var(--space-md);
      }

      h3 {
        margin: 0 0 8px;
        font-size: 1.4rem;
      }

      p {
        color: var(--text-secondary);
        margin: 0 0 var(--space-lg);
      }
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      border-radius: var(--radius-sm);
      background: var(--primary-red);
      color: white;
      padding: 10px 18px;
      font-weight: 700;
      cursor: pointer;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin: 0;
        color: white;
      }
    }

    .seat-layout-row {
      display: flex;
      gap: var(--space-xl);
      align-items: flex-start;
    }

    .layout-left {
      flex: 1;
    }

    .legend-header {
      display: flex;
      align-items: center;
      gap: var(--space-2xl);
      margin-bottom: var(--space-xl);

      h3 { font-size: 1rem; margin: 0; color: var(--text-secondary); font-weight: 500; }
    }

    .legend {
      display: flex;
      gap: var(--space-md);
      .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); }
      .box { width: 16px; height: 16px; border-radius: 2px; }
      .box.avail { border: 1px solid var(--border-color); background: white; }
      .box.booked { background: #e5e7eb; }
      .box.selected { background: var(--primary-red); }
    }

    .decks-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .deck-toggle {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      button {
        padding: 8px 16px; border: 1px solid var(--border-color); background: white; border-radius: 20px; cursor: pointer;
        &.active { background: var(--primary-red); color: white; border-color: var(--primary-red); }
      }
    }

    .bus-body {
      display: grid;
      gap: 12px;
      padding: 30px;
      background: white;
      border: 3px solid #334155;
      border-radius: 40px 15px 15px 40px;
      position: relative;
      box-shadow: var(--shadow-sm);
      margin: 0 auto;
      max-width: fit-content;
    }

    .seat-container {
      position: relative;
      &.is-sleeper { grid-column: span 2; }
    }

    .seat-box {
      width: 44px; height: 44px;
      border-radius: 8px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 800;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      
      mat-icon { font-size: 20px; width: 20px; height: 20px; margin-bottom: 2px; }

      &.sleeper {
        width: 100%; height: 44px;
      }
      
      &.avail {
        background: white; border: 1.5px solid #e2e8f0; color: #64748b;
        &:hover { 
          border-color: var(--primary-red); 
          color: var(--primary-red); 
          background: #fff1f2;
          transform: translateY(-2px);
        }
      }
      &.selected { 
        background: var(--primary-red); 
        border: 1.5px solid var(--primary-red); 
        color: white; 
        box-shadow: 0 6px 12px rgba(225, 29, 72, 0.3);
        transform: translateY(-2px);
      }
      &.booked { 
        background: #f1f5f9; border: 1.5px solid #e2e8f0; color: #cbd5e1; cursor: not-allowed; 
        mat-icon { opacity: 0.5; }
      }
      &.locked { 
        background: #fef2f2; border: 1.5px solid #fee2e2; color: #ef4444; cursor: not-allowed; 
      }
    }

    .seat-label { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: white; padding: 0 4px; font-size: 0.6rem; border-radius: 4px; border: 1px solid #eee; }

    .layout-right {
      width: 300px;
    }

    .summary-box {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .points {
      padding: var(--space-md);
      border-bottom: 1px solid var(--border-color);
    }
    .point-row {
      margin-bottom: 12px;
      &:last-child { margin-bottom: 0; }
      display: flex; flex-direction: column;
    }
    .point-label { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px; }
    .point-value { font-weight: 600; font-size: 0.9rem; }

    .fare-calc {
      padding: var(--space-md);
    }
    .fare-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 8px; font-size: 0.9rem;
    }
    .total-row {
      margin-top: 16px; margin-bottom: 0;
      .total-amt { font-size: 1.5rem; font-weight: 700; color: var(--primary-red); }
    }

    // Floating Action Bar
    .floating-action {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: min(640px, calc(100vw - 48px));
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 28px;
      z-index: 100;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .trip-quick-info {
      display: flex; flex-direction: column;
      .op { font-weight: 600; font-size: 0.92rem; }
      .bt { font-size: 0.78rem; color: var(--text-muted); }
    }

    .time-quick .time { font-size: 1.1rem; font-weight: 700; font-family: var(--font-display); }

    .proceed-btn {
      background: var(--primary-red);
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(225,29,72,0.25);

      &:hover:not(:disabled) {
        background: var(--primary-red-hover);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(225,29,72,0.35);
      }
      &:active:not(:disabled) { transform: translateY(0); }
      &:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    @media (max-width: 1024px) {
      .content-layout { padding: 0; }
    }
    @media (max-width: 768px) {
      .seat-layout-row { flex-direction: column; }
      .layout-right { width: 100%; }
      .decks-container { flex-direction: column; }
    }
  `]
})
export class SeatSelectionComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripService = inject(TripService);
  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);

  tripId!: number;
  trip: Trip | null = null;
  seats: SeatStatus[] = [];
  selectedSeats: SeatStatus[] = [];
  isLoading = true;
  isLocking = false;
  currentDeck = 'lower';

  refreshInterval: any;

  ngOnInit() {
    this.tripId = Number(this.route.snapshot.paramMap.get('tripId'));
    this.loadTripAndSeats();

    this.refreshInterval = setInterval(() => {
      if (!this.isLocking) {
        this.loadSeats(false);
      }
    }, 10000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadTripAndSeats() {
    this.tripService.getTripById(this.tripId).subscribe({
      next: (t: Trip) => {
        this.trip = t;
        this.loadSeats(true);
      },
      error: () => this.isLoading = false
    });
  }

  loadSeats(hideLoader = false) {
    if (hideLoader) this.isLoading = true;
    this.tripService.getTripSeats(this.tripId).subscribe({
      next: (res) => {
        this.seats = res;
        this.selectedSeats = this.selectedSeats.filter(s => {
          const fresh = this.seats.find(fs => fs.seatId === s.seatId);
          return fresh && fresh.status === 'available';
        });
        if (hideLoader) this.isLoading = false;
      },
      error: () => {
        if (hideLoader) this.isLoading = false;
      }
    });
  }

  getSeatsForDeck(deck: string): SeatStatus[] {
    return this.seats.filter(s => s.deck === deck);
  }

  // All seats shown in a single flat layout

  getSeatClass(seat: SeatStatus): string {
    if (this.selectedSeats.some(s => s.seatId === seat.seatId)) return 'selected';
    if (seat.status === 'booked') return 'booked';
    if (seat.status === 'locked') return 'locked';
    return 'avail';
  }

  hasAvailableSeats(): boolean {
    return this.seats.some(seat => seat.status === 'available');
  }

  goBackToSearch() {
    history.length > 1 ? history.back() : this.router.navigate(['/']);
  }

  toggleSeat(seat: SeatStatus) {
    if (seat.status !== 'available') return;
    const index = this.selectedSeats.findIndex(s => s.seatId === seat.seatId);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      if (this.selectedSeats.length >= 6) {
        this.toastr.warning('Maximum 6 seats per booking');
        return;
      }
      this.selectedSeats.push(seat);
    }
  }

  getSelectedSeatNumbers(): string {
    return this.selectedSeats.map(s => s.seatNumber).join(', ');
  }

  getTotalAmount(): number {
    if (!this.trip) return 0;
    return this.selectedSeats.length * this.trip.totalFare;
  }

  getDuration(start: Date, end: Date): string {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = (e - s) / 1000;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m`;
  }

  proceedToPassengerForm() {
    if (this.selectedSeats.length === 0) return;
    this.isLocking = true;
    const seatIds = this.selectedSeats.map(s => s.seatId);

    this.bookingService.lockSeats(this.tripId, seatIds).subscribe({
      next: (res) => {
        sessionStorage.setItem('selectedSeats', JSON.stringify(this.selectedSeats));
        this.router.navigate(['/booking/passengers', this.tripId]);
      },
      error: () => {
        this.isLocking = false;
        this.loadSeats();
      }
    });
  }
}
