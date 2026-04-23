import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  template: `
    <div class="schedule-trips">
      <h1>Schedule Trips</h1>

      <mat-card class="form-card">
        <mat-card-header><mat-card-title>Create New Trip</mat-card-title></mat-card-header>
        <mat-card-content>
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

            <button mat-raised-button color="primary" type="submit" [disabled]="tripForm.invalid || isSaving">
              {{ isSaving ? 'Creating...' : 'Schedule Trip' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      @if (isLoading) {
        <div class="loading"><mat-spinner></mat-spinner></div>
      } @else {
        <mat-card class="table-card">
          <mat-card-header><mat-card-title>My Trips</mat-card-title></mat-card-header>
          <table mat-table [dataSource]="trips" class="full-width">
            <ng-container matColumnDef="busName">
              <th mat-header-cell *matHeaderCellDef>Bus</th>
              <td mat-cell *matCellDef="let trip">{{ trip.busName }}</td>
            </ng-container>

            <ng-container matColumnDef="route">
              <th mat-header-cell *matHeaderCellDef>Route</th>
              <td mat-cell *matCellDef="let trip">{{ trip.route }}</td>
            </ng-container>

            <ng-container matColumnDef="departure">
              <th mat-header-cell *matHeaderCellDef>Departure</th>
              <td mat-cell *matCellDef="let trip">{{ trip.departureTime | date:'medium' }}</td>
            </ng-container>

            <ng-container matColumnDef="arrival">
              <th mat-header-cell *matHeaderCellDef>Arrival</th>
              <td mat-cell *matCellDef="let trip">{{ trip.arrivalTime | date:'medium' }}</td>
            </ng-container>

            <ng-container matColumnDef="fare">
              <th mat-header-cell *matHeaderCellDef>Fare</th>
              <td mat-cell *matCellDef="let trip">₹{{ trip.baseFare }}</td>
            </ng-container>

            <ng-container matColumnDef="occupancy">
              <th mat-header-cell *matHeaderCellDef>Occupancy</th>
              <td mat-cell *matCellDef="let trip">{{ trip.bookedSeats }}/{{ trip.totalSeats }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let trip">
                <span [class]="'badge ' + trip.status">{{ trip.status }}</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .schedule-trips { max-width: 1200px; }
    h1 { margin-bottom: 24px; color: #333; }
    .loading { display: flex; justify-content: center; padding: 60px 0; }
    .form-card { margin-bottom: 24px; padding: 16px; }
    .trip-form {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: flex-start;
      mat-form-field { flex: 1; min-width: 180px; }
      button { margin-top: 8px; height: 56px; }
    }
    .table-card { padding: 0; overflow-x: auto; }
    .full-width { width: 100%; }
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge.scheduled { background: #e8f5e9; color: #2e7d32; }
    .badge.cancelled { background: #fce4ec; color: #c62828; }
    .badge.completed { background: #e3f2fd; color: #1565c0; }
  `]
})
export class ScheduleTripsComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  buses: BusData[] = [];
  routes: any[] = [];
  trips: OperatorTrip[] = [];
  isLoading = true;
  isSaving = false;
  displayedColumns = ['busName', 'route', 'departure', 'arrival', 'fare', 'occupancy', 'status'];

  tripForm = this.fb.group({
    busId: [null as number | null, Validators.required],
    routeId: [null as number | null, Validators.required],
    departureTime: ['', Validators.required],
    arrivalTime: ['', Validators.required],
    baseFare: [800, [Validators.required, Validators.min(1)]],
    taxPercent: [5, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.operatorService.getMyBuses().subscribe(data => this.buses = data);
    this.operatorService.getRoutes().subscribe(data => this.routes = data);
    this.loadTrips();
  }

  loadTrips() {
    this.operatorService.getMyTrips().subscribe({
      next: (data) => { this.trips = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
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
