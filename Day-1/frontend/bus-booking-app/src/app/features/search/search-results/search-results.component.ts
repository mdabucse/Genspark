import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { TripService } from '../../../core/services/trip.service';
import { Trip } from '../../../core/models/trip.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatIconModule, 
    MatProgressSpinnerModule, 
    MatSliderModule, 
    MatCheckboxModule, 
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="page-bg">
      <!-- Modify Search Bar -->
      <div class="modify-search-bar animate-fade-in">
        <div class="search-inner">
          <form [formGroup]="searchForm" (ngSubmit)="onModifySearch()" class="compact-search-form">
            <div class="compact-input">
              <mat-icon>location_on</mat-icon>
              <input type="text" formControlName="source" [matAutocomplete]="sourceAuto" placeholder="From">
              <mat-autocomplete #sourceAuto="matAutocomplete">
                @for (city of sourceSuggestions; track city) {
                  <mat-option [value]="city">{{ city }}</mat-option>
                }
              </mat-autocomplete>
            </div>
            
            <div class="search-swap">
              <mat-icon>swap_horiz</mat-icon>
            </div>

            <div class="compact-input">
              <mat-icon>location_on</mat-icon>
              <input type="text" formControlName="destination" [matAutocomplete]="destAuto" placeholder="To">
              <mat-autocomplete #destAuto="matAutocomplete">
                @for (city of destinationSuggestions; track city) {
                  <mat-option [value]="city">{{ city }}</mat-option>
                }
              </mat-autocomplete>
            </div>

            <div class="compact-input date-input" (click)="picker.open()">
              <mat-icon>calendar_today</mat-icon>
              <input [matDatepicker]="picker" formControlName="date" readonly placeholder="Date">
              <mat-datepicker #picker></mat-datepicker>
            </div>

            <button type="submit" class="modify-btn" [disabled]="searchForm.invalid">MODIFY</button>
          </form>
        </div>
      </div>

      <div class="search-layout">
        
        <!-- Left: Filters Sidebar -->
        <aside class="filters-sidebar">
          <div class="filters-card">
            <h3 class="filters-title">Filters</h3>
            
            <div class="filter-group">
              <h4 class="filter-label">Departure Time</h4>
              <div class="time-filters">
                <div class="time-box" [class.active]="departureWindow === 'early'" (click)="setDepartureWindow('early')">
                  <mat-icon>wb_twilight</mat-icon>
                  <span>Before 6 AM</span>
                </div>
                <div class="time-box" [class.active]="departureWindow === 'day'" (click)="setDepartureWindow('day')">
                  <mat-icon>light_mode</mat-icon>
                  <span>6 AM - 12 PM</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-label">Bus Type</h4>
              <mat-checkbox color="warn" [checked]="selectedBusTypes.has('AC')" (change)="toggleBusType('AC', $event.checked)">AC</mat-checkbox>
              <mat-checkbox color="warn" [checked]="selectedBusTypes.has('Non-AC')" (change)="toggleBusType('Non-AC', $event.checked)">Non-AC</mat-checkbox>
              <mat-checkbox color="warn" [checked]="selectedBusTypes.has('Sleeper')" (change)="toggleBusType('Sleeper', $event.checked)">Sleeper</mat-checkbox>
            </div>

            <div class="filter-group">
              <h4 class="filter-label">Ratings</h4>
              <mat-checkbox color="warn">4 <mat-icon class="star-icon">star</mat-icon> & above</mat-checkbox>
              <mat-checkbox color="warn">3 <mat-icon class="star-icon">star</mat-icon> & above</mat-checkbox>
            </div>

            <div class="filter-group">
              <h4 class="filter-label">Price Range</h4>
              <mat-slider min="0" [max]="priceCeiling" class="price-slider">
                <input matSliderThumb [value]="maxPrice" (valueChange)="setMaxPrice($event)">
              </mat-slider>
              <div class="price-labels">
                <span>₹0</span>
                <span>₹{{ maxPrice }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right: Bus List -->
        <main class="results-main">
          @if (isLoading) {
            <div class="loading-state">
              <mat-spinner diameter="44"></mat-spinner>
            </div>
          } @else {
            <div class="results-header">
              <h2 class="results-count">
                {{ filteredTrips.length }} buses found for {{ source }} to {{ destination }}
                <span class="results-date">on {{ date | date:'dd MMM yyyy' }}</span>
              </h2>
              <div class="sort-by">
                <span>Sort by:</span>
                <mat-select class="sort-select" [value]="sortBy" (selectionChange)="setSort($event.value)">
                  <mat-option value="price">Price (Low to High)</mat-option>
                  <mat-option value="departure">Departure Time</mat-option>
                  <mat-option value="duration">Duration</mat-option>
                  <mat-option value="seats">Available Seats</mat-option>
                </mat-select>
              </div>
            </div>

            @if (filteredTrips.length === 0) {
              <div class="empty-state">
                <mat-icon>directions_bus</mat-icon>
                <p>No buses found for this route.</p>
              </div>
            }

            <div class="bus-list">
              @for (trip of filteredTrips; track trip.tripId) {
                @if (trip.status === 'no_trips') {
                  <!-- Coming Soon Card -->
                  <div class="bus-card coming-soon-card">
                    <div class="card-left">
                      <div class="operator-info">
                        <h3 class="operator-name">{{ trip.source }} → {{ trip.destination }}</h3>
                        <p class="bus-type">Route Available</p>
                        <div class="coming-soon-badge">
                          <mat-icon>schedule</mat-icon>
                          <span>Coming Soon</span>
                        </div>
                      </div>
                      <div class="timeline">
                        <div class="time-block text-right">
                          <span class="time">--:--</span>
                          <span class="station">{{ trip.source }}</span>
                        </div>
                        
                        <div class="duration-line">
                          <span class="duration-text">--</span>
                          <div class="line">
                            <div class="dot"></div>
                            <div class="dot"></div>
                          </div>
                        </div>

                        <div class="time-block">
                          <span class="time">--:--</span>
                          <span class="station">{{ trip.destination }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="card-right">
                      <div class="coming-soon-message">
                        <p>No buses scheduled yet on this date</p>
                        <p class="sub-text">Check back later or try a different date</p>
                      </div>
                    </div>
                  </div>
                } @else {
                  <!-- Regular Bus Card -->
                  <div class="bus-card">
                    <div class="card-left">
                      <div class="operator-info">
                        <h3 class="operator-name">{{ trip.operatorName }}</h3>
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
                        <span class="rating-count">1.2k Ratings</span>
                      </div>
                      
                      <div class="price-action">
                        <span class="seat-count"
                          [class.sold-out]="isSoldOut(trip)"
                          [class.low-seats]="!isSoldOut(trip) && trip.availableSeats <= 5">
                          {{ getSeatsLabel(trip) }}
                        </span>
                        <div class="price-block">
                          <span class="old-price">₹{{ trip.totalFare + 200 }}</span>
                          <span class="new-price">₹{{ trip.totalFare }}</span>
                        </div>
                        <button 
                          class="btn-primary select-btn" 
                          [class.sold-out-btn]="isSoldOut(trip)"
                          [disabled]="isSoldOut(trip)"
                          (click)="viewSeats(trip)"
                        >
                          {{ isSoldOut(trip) ? 'Sold Out' : 'Select Seat' }}
                        </button>
                      </div>
                    </div>
                  </div>
                }
              }
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .page-bg {
      background: var(--bg-light);
      min-height: calc(100vh - var(--header-height));
      padding: 0;
    }

    /* Modify Search Bar */
    .modify-search-bar {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 12px 0;
      position: sticky;
      top: var(--header-height);
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .search-inner {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: 0 var(--space-lg);
    }

    .compact-search-form {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .compact-input {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      transition: all 0.2s;

      &:focus-within {
        border-color: var(--primary-red);
        background: white;
        box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
      }

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: #94a3b8; }
      input {
        border: none;
        background: transparent;
        font-family: var(--font-display);
        font-weight: 500;
        font-size: 0.9rem;
        color: var(--text-main);
        width: 100%;
        outline: none;
        &::placeholder { color: #94a3b8; }
      }
    }

    .search-swap {
      color: #94a3b8;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover { color: var(--primary-red); }
    }

    .modify-btn {
      background: var(--primary-red);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 24px;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { background: #c62828; transform: translateY(-1px); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .search-layout {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: var(--space-xl);

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    // Sidebar
    .filters-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0;
      position: sticky;
      top: 100px;
    }

    .filters-title {
      font-size: 1rem;
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--border-color);
      margin: 0;
    }

    .filter-group {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 12px;

      &:last-child { border-bottom: none; }
    }

    .filter-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0 0 4px 0;
    }

    .time-filters {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .time-box {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      mat-icon { color: var(--text-muted); font-size: 20px; width: 20px; height: 20px; }
      span { font-size: 0.75rem; font-weight: 500; text-align: center; }

      &.active {
        border-color: var(--primary-red);
        color: var(--primary-red);
        background: var(--primary-red-dim);
        mat-icon { color: var(--primary-red); }
      }
    }

    .star-icon { font-size: 14px; width: 14px; height: 14px; vertical-align: bottom; }

    ::ng-deep .mat-mdc-checkbox {
      label { font-size: 0.9rem; color: var(--text-main); }
    }

    .price-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    // Main
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);

      .results-count {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .results-date {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 400;
        }
      }

      .sort-by {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary);

        .sort-active {
          color: var(--primary-red);
          font-weight: 600;
          display: flex;
          align-items: center;
          cursor: pointer;
          mat-icon { font-size: 18px; width: 18px; height: 18px; }
        }
      }
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: var(--space-3xl);
    }

    .empty-state {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: var(--space-3xl);
      text-align: center;
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 16px; }
    }

    // Bus Card
    .bus-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .bus-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: var(--space-xl);
      display: flex;
      justify-content: space-between;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: var(--shadow-md);
      }

      @media (max-width: 768px) {
        flex-direction: column;
        gap: var(--space-xl);
      }
    }

    .card-left {
      display: flex;
      gap: 64px;
      flex: 1;

      @media (max-width: 1024px) {
        gap: 32px;
      }
      @media (max-width: 600px) {
        flex-direction: column;
        gap: var(--space-lg);
      }
    }

    .operator-info {
      width: 180px;
      .operator-name { font-size: 1.1rem; font-weight: 600; margin: 0 0 4px 0; }
      .bus-type { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 8px 0; }
      .amenities {
        display: flex;
        gap: 8px;
        mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--text-muted); }
      }
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
      .station { font-size: 0.85rem; color: var(--text-secondary); max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }

    .duration-line {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;

      .duration-text { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px; }
      .line {
        width: 100%;
        height: 1px;
        background: var(--text-muted);
        position: relative;
        
        .dot {
          position: absolute;
          top: -2px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--text-muted);
          &:first-child { left: 0; }
          &:last-child { right: 0; }
        }
      }
    }

    .card-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      min-width: 140px;
    }

    .rating-badge {
      display: flex;
      align-items: center;
      gap: 8px;

      .rating {
        background: var(--success-green);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 2px;
        mat-icon { font-size: 12px; width: 12px; height: 12px; }
      }
      .rating-count { font-size: 0.8rem; color: var(--text-secondary); }
    }

    .price-action {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .seat-count {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--success-green);

      &.sold-out {
        color: var(--primary-red);
      }

      &.low-seats {
        color: #f59e0b;
      }
    }

    .price-block {
      display: flex;
      align-items: baseline;
      gap: 8px;
      .old-price { font-size: 0.9rem; color: var(--text-muted); text-decoration: line-through; }
      .new-price { font-size: 1.6rem; font-weight: 700; color: var(--primary-red); }
    }

    .select-btn {
      width: 100%;

      &:disabled,
      &.sold-out-btn {
        background: #9ca3af;
        cursor: not-allowed;
        opacity: 0.8;
      }
    }

    // Coming Soon Card Styles
    .coming-soon-card {
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      border: 2px dashed var(--border-color);

      &:hover {
        box-shadow: none;
      }
    }

    .coming-soon-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #fef3c7;
      color: #92400e;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      width: fit-content;
      margin-top: 8px;

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }

    .coming-soon-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-align: center;

      p {
        margin: 0;
        font-size: 0.95rem;
        color: var(--text-secondary);
        font-weight: 500;

        &.sub-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      }
    }
  `]
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripService = inject(TripService);
  private fb = inject(FormBuilder);

  source = '';
  destination = '';
  date = '';

  // Autocomplete
  sourceSuggestions: string[] = [];
  destinationSuggestions: string[] = [];

  searchForm = this.fb.group({
    source: ['', Validators.required],
    destination: ['', Validators.required],
    date: [new Date(), Validators.required]
  });

  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  isLoading = false;
  departureWindow: 'all' | 'early' | 'day' = 'all';
  selectedBusTypes = new Set<string>();
  sortBy: 'price' | 'departure' | 'duration' | 'seats' = 'price';
  maxPrice = 2000;
  priceCeiling = 2000;

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.source = params['source'];
      this.destination = params['destination'];
      this.date = params['date'];

      if (this.source && this.destination && this.date) {
        // Update form values to match current search
        this.searchForm.patchValue({
          source: this.source,
          destination: this.destination,
          date: new Date(this.date)
        });
        this.searchTrips();
      }
    });

    // Autocomplete Logic
    this.searchForm.controls.source.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((val: string | null) => this.tripService.getSourceSuggestions(val || ''))
    ).subscribe((res: string[]) => this.sourceSuggestions = res);

    this.searchForm.controls.destination.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((val: string | null) => this.tripService.getDestinationSuggestions(this.searchForm.value.source || '', val || ''))
    ).subscribe((res: string[]) => this.destinationSuggestions = res);
  }

  onModifySearch() {
    if (this.searchForm.invalid) return;
    const val = this.searchForm.value;
    const d = val.date as Date;
    const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        source: val.source,
        destination: val.destination,
        date: dateStr
      },
      queryParamsHandling: 'merge'
    });
  }

  searchTrips() {
    this.isLoading = true;
    this.tripService.searchTrips(this.source, this.destination, this.date)
      .subscribe({
        next: (res: Trip[]) => {
          this.trips = res;
          this.priceCeiling = Math.max(2000, Math.ceil(Math.max(0, ...res.map((t: Trip) => Number(t.totalFare) || 0))));
          this.maxPrice = this.priceCeiling;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  setDepartureWindow(window: 'early' | 'day') {
    this.departureWindow = this.departureWindow === window ? 'all' : window;
    this.applyFilters();
  }

  toggleBusType(type: string, checked: boolean) {
    if (checked) {
      this.selectedBusTypes.add(type);
    } else {
      this.selectedBusTypes.delete(type);
    }
    this.applyFilters();
  }

  setMaxPrice(value: number) {
    this.maxPrice = value;
    this.applyFilters();
  }

  setSort(sortBy: 'price' | 'departure' | 'duration' | 'seats') {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  private applyFilters() {
    const selectedTypes = Array.from(this.selectedBusTypes);

    this.filteredTrips = this.trips
      .filter(trip => trip.status === 'no_trips' || Number(trip.totalFare) <= this.maxPrice)
      .filter(trip => trip.status === 'no_trips' || selectedTypes.length === 0 || selectedTypes.some(type => trip.busType.toLowerCase().includes(type.toLowerCase())))
      .filter(trip => {
        if (trip.status === 'no_trips') return true;
        if (this.departureWindow === 'all') return true;
        const hour = new Date(trip.departureTime).getHours();
        if (this.departureWindow === 'early') return hour < 6;
        return hour >= 6 && hour < 12;
      })
      .sort((a, b) => {
        // Always show "no_trips" status at the end
        if (a.status === 'no_trips' && b.status !== 'no_trips') return 1;
        if (a.status !== 'no_trips' && b.status === 'no_trips') return -1;
        if (a.status === 'no_trips' && b.status === 'no_trips') return 0;
        
        switch (this.sortBy) {
          case 'departure':
            return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
          case 'duration':
            return this.durationMs(a) - this.durationMs(b);
          case 'seats':
            return b.availableSeats - a.availableSeats;
          default:
            return Number(a.totalFare) - Number(b.totalFare);
        }
      });
  }

  private durationMs(trip: Trip): number {
    return new Date(trip.arrivalTime).getTime() - new Date(trip.departureTime).getTime();
  }

  getDuration(start: Date, end: Date): string {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = (e - s) / 1000;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m`;
  }

  isSoldOut(trip: Trip): boolean {
    return trip.availableSeats <= 0;
  }

  getSeatsLabel(trip: Trip): string {
    if (this.isSoldOut(trip)) return 'No seats available';
    const avail = trip.availableSeats;
    const total = trip.totalSeats || avail;
    if (avail <= 5) return `Hurry! Only ${avail} seat${avail === 1 ? '' : 's'} left`;
    return `${avail} / ${total} seats available`;
  }

  viewSeats(trip: Trip) {
    if (this.isSoldOut(trip)) return;
    this.router.navigate(['/booking', trip.tripId]);
  }
}
