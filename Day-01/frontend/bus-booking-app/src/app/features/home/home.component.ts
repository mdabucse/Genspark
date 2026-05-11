import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { TripService } from '../../core/services/trip.service';
import { Route } from '../../core/services/trip.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <!-- We use a gradient to simulate the bus image background since we don't have an asset -->
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>Your Journey Begins Here</h1>
          
          <!-- Search Bar -->
          <div class="search-container">
            <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-form">
              <div class="input-col">
                <label>From</label>
                <div class="input-wrapper">
                  <mat-icon>location_on</mat-icon>
                  <input type="text" formControlName="source" placeholder="Departure City" [matAutocomplete]="sourceAuto">
                  <mat-autocomplete #sourceAuto="matAutocomplete" (optionSelected)="onSourceSelected()">
                    @for (city of sourceSuggestions; track city) {
                      <mat-option [value]="city">{{ city }}</mat-option>
                    }
                  </mat-autocomplete>
                </div>
              </div>
              <div class="input-col">
                <label>To</label>
                <div class="input-wrapper">
                  <mat-icon>location_on</mat-icon>
                  <input type="text" formControlName="destination" placeholder="Destination City" [matAutocomplete]="destinationAuto">
                  <mat-autocomplete #destinationAuto="matAutocomplete">
                    @for (city of destinationSuggestions; track city) {
                      <mat-option [value]="city">{{ city }}</mat-option>
                    }
                  </mat-autocomplete>
                </div>
              </div>
              <div class="input-col">
                <label>Date</label>
                <div class="input-wrapper" (click)="picker.open()">
                  <mat-icon>calendar_today</mat-icon>
                  <input type="text" [matDatepicker]="picker" formControlName="date" placeholder="mm/dd/yyyy" [min]="minDate" readonly>
                  <mat-datepicker #picker></mat-datepicker>
                </div>
              </div>
              <button type="submit" class="search-btn" [disabled]="searchForm.invalid">SEARCH BUSES</button>
            </form>
          </div>
        </div>
      </section>

      <!-- Offers Section -->
      <section class="section offers-section">
        <div class="section-header">
          <h2>Trending Offers</h2>
          <a href="#" class="view-all">View All</a>
        </div>
        <div class="offers-grid">
          <div class="offer-card primary-offer">
            <div class="offer-icon">
              <span>₹</span>
            </div>
            <div class="offer-details">
              <span class="offer-subtitle">SAVE UP TO</span>
              <span class="offer-title">₹250 OFF</span>
              <span class="offer-code">Use Code: BUS250</span>
            </div>
          </div>
          <div class="offer-card secondary-offer">
            <div class="offer-icon-box">
              <mat-icon>account_balance_wallet</mat-icon>
            </div>
            <div class="offer-details">
              <span class="offer-title">Cashback Offer</span>
              <span class="offer-desc">10% back on ICICI Cards</span>
              <span class="offer-code red-code">CODE: ICICI10</span>
            </div>
          </div>
          <div class="offer-card secondary-offer">
            <div class="offer-icon-box">
              <mat-icon>local_activity</mat-icon>
            </div>
            <div class="offer-details">
              <span class="offer-title">First Ride Free</span>
              <span class="offer-desc">For new app users only</span>
              <span class="offer-code red-code">CODE: NEWUSER</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Section -->
      <section class="section why-choose">
        <div class="section-inner">
          <div class="why-header">
            <h2>Why Choose BusReserve?</h2>
            <p>Experience the most reliable bus booking ecosystem</p>
          </div>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon"><mat-icon>verified_user</mat-icon></div>
              <h3>Secure Payments</h3>
              <p>Safe and encrypted transactions for all bookings.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><mat-icon>support_agent</mat-icon></div>
              <h3>24/7 Support</h3>
              <p>Our dedicated team is always here to help you.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><mat-icon>directions_bus</mat-icon></div>
              <h3>2000+ Operators</h3>
              <p>Wider range of bus partners across the country.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><mat-icon>local_offer</mat-icon></div>
              <h3>Best Price</h3>
              <p>Guaranteed lowest prices for your bus journey.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Top Routes Section -->
      <section class="section routes-section">
        <h2>Top Bus Routes</h2>
        <div class="routes-grid">
          @if (routes.length === 0) {
            <p class="no-routes">Loading available routes...</p>
          } @else {
            @for (route of routes.slice(0, 4); track route.id) {
              <div class="route-card" (click)="searchRoute(route)">
                <span>{{ route.source }}</span>
                <mat-icon class="route-arrow">arrow_forward</mat-icon>
                <span>{{ route.destination }}</span>
                <mat-icon class="chevron">chevron_right</mat-icon>
              </div>
            }
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      background: var(--bg-main);
    }

    /* Hero */
    .hero {
      position: relative;
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop') center/cover no-repeat;
      z-index: 0;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1000px;
      text-align: center;
      margin-top: -40px;

      h1 {
        color: white;
        font-size: 2.8rem;
        font-weight: 700;
        margin-bottom: var(--space-2xl);
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        background: none;
        -webkit-background-clip: unset;
        -webkit-text-fill-color: white;
      }
    }

    /* Custom Search Bar */
    .search-container {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: var(--space-md) var(--space-lg);
      box-shadow: var(--shadow-md);
    }

    .search-form {
      display: flex;
      align-items: flex-end;
      gap: var(--space-lg);
    }

    .input-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;

      label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-bottom: 4px;
        margin-left: 4px;
      }
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 12px;
      cursor: text;
      transition: all var(--transition-base);

      &:focus-within {
        border-color: var(--primary-red);
        background: white;
        box-shadow: 0 0 0 2px var(--primary-red-dim);
      }

      mat-icon {
        color: var(--text-muted);
        font-size: 20px; width: 20px; height: 20px;
      }

      input {
        border: none;
        background: transparent;
        outline: none;
        font-family: var(--font-body);
        font-size: 0.95rem;
        color: var(--text-main);
        width: 100%;
        cursor: inherit;
        
        &::placeholder { color: var(--text-muted); }
      }
    }

    .search-btn {
      background: var(--primary-red);
      color: white;
      border: none;
      height: 48px;
      padding: 0 32px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-family: var(--font-body);
      cursor: pointer;
      transition: background 0.2s;

      &:hover:not(:disabled) { background: var(--primary-red-hover); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    /* Sections */
    .section {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: var(--space-3xl) var(--space-lg);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      h2 { font-size: 1.8rem; margin: 0; }
      .view-all { color: var(--primary-red); font-weight: 500; font-size: 0.9rem; }
    }

    /* Offers */
    .offers-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-lg);
    }

    .offer-card {
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      border: 1px solid var(--glass-border);
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      transition: all var(--transition-base);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: rgba(0,0,0,0.12);
      }
    }

    .primary-offer {
      background: var(--primary-red);
      color: white;
      border-color: var(--primary-red);

      .offer-icon {
        width: 60px; height: 60px;
        background: rgba(0,0,0,0.2);
        border-radius: var(--radius-sm);
        display: flex; align-items: center; justify-content: center;
        font-size: 24px; font-weight: 700;
      }
      .offer-subtitle { font-size: 0.75rem; opacity: 0.9; }
      .offer-title { font-size: 1.4rem; font-weight: 700; margin: 4px 0; }
      .offer-code { font-size: 0.8rem; opacity: 0.9; }
    }

    .secondary-offer {
      .offer-icon-box {
        width: 48px; height: 48px;
        background: rgba(0,0,0,0.05);
        border-radius: var(--radius-sm);
        display: flex; align-items: center; justify-content: center;
        mat-icon { color: var(--text-main); }
      }
      .offer-title { font-weight: 600; color: var(--text-main); display: block; }
      .offer-desc { font-size: 0.85rem; color: var(--text-secondary); display: block; margin: 4px 0; }
      .red-code { font-size: 0.75rem; font-weight: 700; color: var(--primary-red); }
    }

    .offer-details { display: flex; flex-direction: column; }

    /* Why Choose */
    .why-choose {
      max-width: 100%;
      background: var(--bg-light);
      padding: var(--space-3xl) 0;
    }

    .section-inner {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: 0 var(--space-lg);
    }

    .why-header {
      text-align: center;
      margin-bottom: var(--space-2xl);
      h2 { font-size: 1.8rem; margin: 0 0 8px 0; }
      p { color: var(--text-secondary); margin: 0; }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-xl);
      text-align: center;
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .feature-icon {
        width: 64px; height: 64px;
        background: rgba(0,0,0,0.02);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: var(--space-md);
        box-shadow: var(--shadow-sm);
        mat-icon { color: var(--primary-red); font-size: 28px; width: 28px; height: 28px; }
      }

      h3 { font-size: 1.1rem; margin: 0 0 8px 0; }
      p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.5; }
    }

    /* Routes */
    .routes-section {
      h2 { font-size: 1.8rem; margin-bottom: var(--space-xl); }
    }

    .routes-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
    }

    .route-card {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      cursor: pointer;
      transition: all var(--transition-base);

      &:hover { 
        border-color: var(--primary-red); 
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
      }

      span { font-weight: 500; font-size: 0.95rem; }
      .route-arrow { font-size: 16px; width: 16px; height: 16px; color: var(--text-muted); }
      .chevron { margin-left: auto; color: var(--primary-red); font-size: 20px; width: 20px; height: 20px; }
    }

    @media (max-width: 900px) {
      .search-form { flex-direction: column; align-items: stretch; }
      .search-btn { margin-top: var(--space-md); }
      .offers-grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr 1fr; }
      .routes-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 600px) {
      .features-grid, .routes-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private tripService = inject(TripService);

  minDate = new Date();
  sourceSuggestions: string[] = [];
  destinationSuggestions: string[] = [];
  routes: Array<{ id: number; source: string; destination: string }> = [];

  searchForm = this.fb.group({
    source: ['', Validators.required],
    destination: ['', Validators.required],
    date: [new Date(), Validators.required]
  });

  ngOnInit() {
    this.loadRoutes();
    
    const sourceControl = this.searchForm.controls.source;
    const destinationControl = this.searchForm.controls.destination;

    sourceControl.valueChanges.pipe(
      startWith(sourceControl.value ?? ''),
      debounceTime(180),
      distinctUntilChanged(),
      switchMap((value: string | null) => this.tripService.getSourceSuggestions(value ?? ''))
    ).subscribe((suggestions: string[]) => {
      this.sourceSuggestions = suggestions;
    });

    sourceControl.valueChanges.pipe(
      startWith(sourceControl.value ?? ''),
      debounceTime(180),
      distinctUntilChanged()
    ).subscribe(() => {
      destinationControl.setValue('', { emitEvent: true });
    });

    destinationControl.valueChanges.pipe(
      startWith(destinationControl.value ?? ''),
      debounceTime(180),
      distinctUntilChanged(),
      switchMap((value: string | null) => this.tripService.getDestinationSuggestions(sourceControl.value ?? '', value ?? ''))
    ).subscribe((suggestions: string[]) => {
      this.destinationSuggestions = suggestions;
    });
  }

  loadRoutes() {
    this.tripService.getRoutes().subscribe({
      next: (routes: Route[]) => {
        this.routes = routes.map((r: Route) => ({
          id: r.id,
          source: r.source,
          destination: r.destination
        }));
      },
      error: (err: unknown) => {
        console.error('Failed to load routes:', err);
        // Fallback routes if API fails
        this.routes = [
          { id: 1, source: 'Mumbai', destination: 'Pune' },
          { id: 2, source: 'Delhi', destination: 'Jaipur' },
          { id: 3, source: 'Bangalore', destination: 'Chennai' },
          { id: 4, source: 'Hyderabad', destination: 'Vijayawada' }
        ];
      }
    });
  }

  onSourceSelected() {
    this.searchForm.controls.destination.setValue('');
  }

  searchRoute(route: { source: string; destination: string }) {
    this.searchForm.patchValue({
      source: route.source,
      destination: route.destination
    });
    this.onSearch();
  }

  onSearch() {
    if (this.searchForm.invalid) return;

    const val = this.searchForm.value;
    const d = val.date as Date;
    // Format date as YYYY-MM-DD using local components to avoid timezone shifts
    const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

    this.router.navigate(['/search'], {
      queryParams: {
        source: val.source,
        destination: val.destination,
        date: dateStr
      }
    });
  }
}
