import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OperatorService, BusData } from '../../../core/services/operator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-buses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatChipsModule, MatProgressSpinnerModule],
  template: `
    <div class="manage-buses">
      <h1>My Buses</h1>

      <mat-card class="form-card">
        <mat-card-header><mat-card-title>Add New Bus</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="busForm" (ngSubmit)="addBus()" class="bus-form">
            <mat-form-field appearance="outline">
              <mat-label>Bus Number</mat-label>
              <input matInput formControlName="busNumber" placeholder="e.g. TN01AB1234">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Bus Name</mat-label>
              <input matInput formControlName="busName" placeholder="e.g. Super Express">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Capacity</mat-label>
              <input matInput type="number" formControlName="capacity" min="1" max="20">
              <mat-hint>Maximum 20 seats allowed</mat-hint>
              @if (busForm.controls.capacity.hasError('max')) {
                <mat-error>Capacity cannot exceed 20 seats</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Bus Type</mat-label>
              <mat-select formControlName="busType">
                <mat-option value="AC Sleeper">AC Sleeper</mat-option>
                <mat-option value="AC Semi-Sleeper">AC Semi-Sleeper</mat-option>
                <mat-option value="Non-AC Sleeper">Non-AC Sleeper</mat-option>
                <mat-option value="Non-AC Seater">Non-AC Seater</mat-option>
                <mat-option value="Volvo Multi-Axle">Volvo Multi-Axle</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Seat Layout</mat-label>
              <mat-select formControlName="seatLayout">
                <mat-option value="2x2">2x2</mat-option>
                <mat-option value="2x1">2x1</mat-option>
                <mat-option value="1x1">1x1</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="busForm.invalid || isSaving">
              {{ isSaving ? 'Adding...' : 'Add Bus' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      @if (isLoading) {
        <div class="loading"><mat-spinner></mat-spinner></div>
      } @else {
        <mat-card class="table-card">
          <table mat-table [dataSource]="buses" class="full-width">
            <ng-container matColumnDef="busNumber">
              <th mat-header-cell *matHeaderCellDef>Bus Number</th>
              <td mat-cell *matCellDef="let bus">{{ bus.busNumber }}</td>
            </ng-container>

            <ng-container matColumnDef="busName">
              <th mat-header-cell *matHeaderCellDef>Bus Name</th>
              <td mat-cell *matCellDef="let bus">{{ bus.busName }}</td>
            </ng-container>

            <ng-container matColumnDef="busType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let bus">{{ bus.busType }}</td>
            </ng-container>

            <ng-container matColumnDef="capacity">
              <th mat-header-cell *matHeaderCellDef>Seats</th>
              <td mat-cell *matCellDef="let bus">{{ bus.capacity }}</td>
            </ng-container>

            <ng-container matColumnDef="seatLayout">
              <th mat-header-cell *matHeaderCellDef>Layout</th>
              <td mat-cell *matCellDef="let bus">{{ bus.seatLayout }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let bus">
                <span [class]="bus.isActive ? 'badge active' : 'badge inactive'">
                  {{ bus.isActive ? 'Active' : 'Blocked' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let bus">
                @if (bus.isActive) {
                  <button mat-icon-button color="warn" (click)="blockBus(bus.id)" matTooltip="Block Bus">
                    <mat-icon>block</mat-icon>
                  </button>
                }
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
    .manage-buses { max-width: 1200px; }
    h1 { margin-bottom: 24px; color: #333; }
    .loading { display: flex; justify-content: center; padding: 60px 0; }
    .form-card { margin-bottom: 24px; padding: 16px; }
    .bus-form {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: flex-start;
      mat-form-field { flex: 1; min-width: 160px; }
      button { margin-top: 8px; height: 56px; }
    }
    .table-card { padding: 0; overflow-x: auto; }
    .full-width { width: 100%; }
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge.active { background: #e8f5e9; color: #2e7d32; }
    .badge.inactive { background: #fce4ec; color: #c62828; }
  `]
})
export class ManageBusesComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  buses: BusData[] = [];
  isLoading = true;
  isSaving = false;
  displayedColumns = ['busNumber', 'busName', 'busType', 'capacity', 'seatLayout', 'status', 'actions'];

  busForm = this.fb.group({
    busNumber: ['', Validators.required],
    busName: ['', Validators.required],
    capacity: [20, [Validators.required, Validators.min(1), Validators.max(20)]],
    busType: ['AC Sleeper', Validators.required],
    seatLayout: ['2x2', Validators.required]
  });

  ngOnInit() { this.loadBuses(); }

  loadBuses() {
    this.operatorService.getMyBuses().subscribe({
      next: (data) => { this.buses = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  addBus() {
    if (this.busForm.invalid) return;
    this.isSaving = true;
    const formVal = this.busForm.value;
    const busData: BusData = {
      busNumber: formVal.busNumber!,
      busName: formVal.busName!,
      capacity: formVal.capacity!,
      busType: formVal.busType!,
      seatLayout: formVal.seatLayout!
    };
    this.operatorService.addBus(busData).subscribe({
      next: () => {
        this.toastr.success('Bus added successfully!');
        this.busForm.reset({ capacity: 20, busType: 'AC Sleeper', seatLayout: '2x2' });
        this.isSaving = false;
        this.loadBuses();
      },
      error: () => { this.isSaving = false; }
    });
  }

  blockBus(id: number) {
    this.operatorService.blockBus(id).subscribe({
      next: () => { this.toastr.success('Bus blocked'); this.loadBuses(); }
    });
  }
}
