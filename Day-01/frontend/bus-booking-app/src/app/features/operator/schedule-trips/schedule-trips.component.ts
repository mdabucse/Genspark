import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OperatorService, BusData, OperatorTrip } from '../../../core/services/operator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedule-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  template: `
    <div class="schedule-trips">
      <div class="page-title">
        <h1>Schedule Trips</h1>
        <p>Create and manage your scheduled bus routes</p>
      </div>

      <div class="form-card">
        <div class="form-card-header">
          <mat-icon>add_circle_outline</mat-icon>
          <h3>Create New Trip</h3>
        </div>
        <form [formGroup]="tripForm" (ngSubmit)="scheduleTrip()" class="trip-form">
          <mat-form-field appearance="outline">
            <mat-label>Select Bus</mat-label>
            <mat-select formControlName="busId">
              @for (bus of buses; track bus.id) {
                <mat-option [value]="bus.id">{{ bus.busName }} ({{ bus.busNumber }})</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Select Route</mat-label>
            <mat-select formControlName="routeId">
              @for (route of routes; track route.id) {
                <mat-option [value]="route.id">{{ route.source }} → {{ route.destination }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Departure Time</mat-label>
            <input matInput type="datetime-local" formControlName="departureTime">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Arrival Time</mat-label>
            <input matInput type="datetime-local" formControlName="arrivalTime">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Base Fare (₹)</mat-label>
            <input matInput type="number" formControlName="baseFare">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Tax %</mat-label>
            <input matInput type="number" formControlName="taxPercent">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Pickup Point (Boarding)</mat-label>
            <input matInput formControlName="pickupPoint" placeholder="e.g. Madiwala Station">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Drop Point (Dropping)</mat-label>
            <input matInput formControlName="dropPoint" placeholder="e.g. Koyambedu Market">
          </mat-form-field>

          <div class="submit-btn-container">
            <button class="submit-btn" type="submit" [disabled]="tripForm.invalid || isSaving">
              @if (isSaving) {
                <span class="btn-loader"></span>
                <span>Creating...</span>
              } @else {
                <mat-icon>schedule</mat-icon>
                <span>Schedule Trip</span>
              }
            </button>
          </div>
        </form>
      </div>

      @if (isLoading) {
        <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
      } @else {
        <div class="table-card">
          <div class="table-header">
            <h3>My Trips</h3>
            <div class="filter-actions">
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilter()">
                  <mat-option value="all">All Trips</mat-option>
                  <mat-option value="scheduled">Scheduled</mat-option>
                  <mat-option value="cancelled">Cancelled</mat-option>
                  <mat-option value="completed">Completed</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div class="table-scroll">
            <table mat-table [dataSource]="filteredTrips" class="performance-table">
              <ng-container matColumnDef="busName">
                <th mat-header-cell *matHeaderCellDef>Bus</th>
                <td mat-cell *matCellDef="let trip">
                  <span class="bus-name-cell">{{ trip.busName }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="route">
                <th mat-header-cell *matHeaderCellDef>Route & Points</th>
                <td mat-cell *matCellDef="let trip">
                  <div class="route-cell">
                    <strong>{{ trip.route }}</strong>
                    @if (trip.pickupPoint || trip.dropPoint) {
                      <span class="points-sub">{{ trip.pickupPoint }} → {{ trip.dropPoint }}</span>
                    }
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="departure">
                <th mat-header-cell *matHeaderCellDef>Departure</th>
                <td mat-cell *matCellDef="let trip">
                  <div class="datetime-cell">
                    <strong>{{ trip.departureTime | date:'dd MMM' }}</strong>
                    <span>{{ trip.departureTime | date:'shortTime' }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="arrival">
                <th mat-header-cell *matHeaderCellDef>Arrival</th>
                <td mat-cell *matCellDef="let trip">
                  <div class="datetime-cell">
                    <strong>{{ trip.arrivalTime | date:'dd MMM' }}</strong>
                    <span>{{ trip.arrivalTime | date:'shortTime' }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="fare">
                <th mat-header-cell *matHeaderCellDef>Fare</th>
                <td mat-cell *matCellDef="let trip">
                  <span class="fare-cell">₹{{ trip.baseFare }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="occupancy">
                <th mat-header-cell *matHeaderCellDef>Occupancy</th>
                <td mat-cell *matCellDef="let trip">
                  <div class="occupancy-cell">
                    <div class="occ-bar">
                      <div class="occ-fill" [style.width.%]="(trip.bookedSeats / trip.totalSeats) * 100"></div>
                    </div>
                    <span class="occ-text">{{ trip.bookedSeats }}/{{ trip.totalSeats }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let trip">
                  <span [class]="'badge ' + trip.status">
                    <span class="badge-dot"></span>
                    {{ trip.status }}
                  </span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          @if (filteredTrips.length === 0) {
            <div class="empty-state">
              <mat-icon>schedule</mat-icon>
              <p>No trips found. Create one above to get started.</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .schedule-trips {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .page-title {
      margin-bottom: 32px;
      h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 4px 0; color: var(--text-main); }
      p { color: var(--text-muted); font-size: 0.95rem; margin: 0; }
    }

    .loading { display: flex; justify-content: center; padding: 60px 0; }

    /* Form Card */
    .form-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: var(--shadow-sm);
    }

    .form-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
      mat-icon { color: var(--primary-red); font-size: 24px; width: 24px; height: 24px; }
      h3 {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-weight: 800;
        margin: 0;
        color: var(--text-main);
      }
    }

    .trip-form {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      align-items: flex-start;

      .full-row { grid-column: 1 / -1; }
      
      .submit-btn-container {
        display: flex;
        align-items: flex-end;
        padding-bottom: 4px;
      }
    }

    .submit-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 52px;
      width: 100%;
      background: var(--primary-red);
      color: white;
      border: none;
      border-radius: 12px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.92rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(225,29,72,0.2);

      &:hover:not(:disabled) {
        background: var(--primary-red-hover);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(225,29,72,0.3);
      }
      &:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(1); }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .btn-loader {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spinSlow 0.8s linear infinite;
    }

    /* Table Card */
    .table-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid var(--border-color);

      h3 {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-weight: 800;
        margin: 0;
        color: var(--text-main);
      }
    }

    .filter-field {
      margin-bottom: -1.25em;
      width: 180px;
    }

    .table-scroll { overflow-x: auto; }
    .full-width { width: 100%; }

    .performance-table {
      width: 100%;
      background: transparent;

      th {
        color: var(--text-muted);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.05em;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
        background: #f8fafc;
      }

      td {
        padding: 16px 24px;
        border-bottom: 1px solid #f1f5f9;
        color: var(--text-main);
      }

      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #f8fafc; }
    }

    .bus-name-cell { font-weight: 700; color: var(--text-main); font-size: 0.95rem; }

    .route-cell {
      display: flex;
      flex-direction: column;
      strong { font-size: 0.9rem; color: var(--text-main); }
      .points-sub {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-weight: 600;
        margin-top: 2px;
      }
    }

    .datetime-cell {
      display: flex;
      flex-direction: column;
      strong { font-size: 0.88rem; color: var(--text-main); }
      span { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
    }

    .fare-cell {
      font-family: var(--font-display);
      font-weight: 800;
      color: #059669;
      font-size: 0.95rem;
    }

    .occupancy-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .occ-bar {
      width: 60px;
      height: 6px;
      background: #f1f5f9;
      border-radius: 100px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .occ-fill {
      height: 100%;
      background: var(--primary-red);
      border-radius: 100px;
      transition: width 0.4s ease;
    }
    .occ-text {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; }
    .badge.scheduled {
      background: rgba(5,150,105,0.1); color: #059669;
      .badge-dot { background: #059669; }
    }
    .badge.cancelled {
      background: rgba(225,29,72,0.1); color: #e11d48;
      .badge-dot { background: #e11d48; }
    }
    .badge.completed {
      background: rgba(8,145,178,0.1); color: #0891b2;
      .badge-dot { background: #0891b2; }
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: var(--text-muted);
      mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.3; }
      p { margin: 0; font-size: 0.95rem; font-weight: 600; }
    }
  `]
})
export class ScheduleTripsComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  buses: BusData[] = [];
  routes: any[] = [];
  trips: OperatorTrip[] = [];
  filteredTrips: OperatorTrip[] = [];
  statusFilter: string = 'all';
  isLoading = true;
  isSaving = false;
  displayedColumns = ['busName', 'route', 'departure', 'arrival', 'fare', 'occupancy', 'status'];

  tripForm = this.fb.group({
    busId: [null as number | null, Validators.required],
    routeId: [null as number | null, Validators.required],
    departureTime: ['', Validators.required],
    arrivalTime: ['', Validators.required],
    baseFare: [800, [Validators.required, Validators.min(1)]],
    taxPercent: [5, [Validators.required, Validators.min(0)]],
    pickupPoint: ['', Validators.required],
    dropPoint: ['', Validators.required]
  });

  ngOnInit() {
    this.operatorService.getMyBuses().subscribe(data => this.buses = data);
    this.operatorService.getRoutes().subscribe(data => this.routes = data);
    this.loadTrips();
  }

  loadTrips() {
    this.operatorService.getMyTrips().subscribe({
      next: (data) => { 
        this.trips = data; 
        this.applyFilter();
        this.isLoading = false; 
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilter() {
    if (this.statusFilter === 'all') {
      this.filteredTrips = [...this.trips];
    } else {
      this.filteredTrips = this.trips.filter(t => t.status.toLowerCase() === this.statusFilter);
    }
  }

  scheduleTrip() {
    if (this.tripForm.invalid) return;
    this.isSaving = true;
    this.operatorService.scheduleTrip(this.tripForm.value).subscribe({
      next: () => {
        this.toastr.success('Trip scheduled successfully!');
        this.tripForm.reset({ baseFare: 800, taxPercent: 5 });
        this.isSaving = false;
        this.loadTrips();
      },
      error: () => { this.isSaving = false; }
    });
  }
}
