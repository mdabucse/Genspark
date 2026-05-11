import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService, RouteData } from '../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-routes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="routes-container">
      <div class="header">
        <h1>Manage Routes</h1>
      </div>

      <div class="content-grid">
        <!-- Add Route Form -->
        <div class="form-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Create New Route</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="routeForm" (ngSubmit)="onSubmit()" class="route-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Source City</mat-label>
                  <input matInput formControlName="source" placeholder="e.g., Mumbai">
                  @if (routeForm.get('source')?.hasError('required')) {
                    <mat-error>Source is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Destination City</mat-label>
                  <input matInput formControlName="destination" placeholder="e.g., Pune">
                  @if (routeForm.get('destination')?.hasError('required')) {
                    <mat-error>Destination is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Distance (Km)</mat-label>
                  <input matInput type="number" formControlName="distanceKm" placeholder="e.g., 150">
                  @if (routeForm.get('distanceKm')?.hasError('required')) {
                    <mat-error>Distance is required</mat-error>
                  }
                  @if (routeForm.get('distanceKm')?.hasError('min')) {
                    <mat-error>Distance must be greater than 0</mat-error>
                  }
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit" [disabled]="routeForm.invalid || isSubmitting" class="full-width">
                  {{ isSubmitting ? 'Creating...' : 'Create Route' }}
                </button>
              </form>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Routes List -->
        <div class="list-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Existing Routes</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (isLoading) {
                <div class="loading-state">
                  <mat-spinner diameter="40"></mat-spinner>
                </div>
              } @else {
                <table mat-table [dataSource]="routes" class="mat-elevation-z0">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef> ID </th>
                    <td mat-cell *matCellDef="let route"> {{route.id}} </td>
                  </ng-container>

                  <ng-container matColumnDef="route">
                    <th mat-header-cell *matHeaderCellDef> Route </th>
                    <td mat-cell *matCellDef="let route"> 
                      <strong>{{route.source}}</strong> <mat-icon class="arrow-icon">arrow_right_alt</mat-icon> <strong>{{route.destination}}</strong>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="distance">
                    <th mat-header-cell *matHeaderCellDef> Distance </th>
                    <td mat-cell *matCellDef="let route"> {{route.distanceKm}} km </td>
                  </ng-container>

                  <ng-container matColumnDef="trips">
                    <th mat-header-cell *matHeaderCellDef> Active Trips </th>
                    <td mat-cell *matCellDef="let route"> {{route.tripCount}} </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              }
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .routes-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 24px;
      h1 { margin: 0; color: #333; }
    }
    .content-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 24px;
      
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .route-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }
    .full-width {
      width: 100%;
    }
    .loading-state {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    table {
      width: 100%;
      margin-top: 16px;
    }
    .arrow-icon {
      vertical-align: middle;
      color: #666;
      margin: 0 4px;
    }
  `]
})
export class ManageRoutesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  routes: RouteData[] = [];
  displayedColumns: string[] = ['id', 'route', 'distance', 'trips'];
  isLoading = true;
  isSubmitting = false;

  routeForm = this.fb.group({
    source: ['', Validators.required],
    destination: ['', Validators.required],
    distanceKm: ['', [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.isLoading = true;
    this.adminService.getRoutes().subscribe({
      next: (data) => {
        this.routes = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.routeForm.invalid) return;

    this.isSubmitting = true;
    
    const payload: RouteData = {
      source: this.routeForm.value.source as string,
      destination: this.routeForm.value.destination as string,
      distanceKm: Number(this.routeForm.value.distanceKm)
    };

    this.adminService.createRoute(payload).subscribe({
      next: () => {
        this.toastr.success('Route created successfully');
        this.routeForm.reset();
        this.isSubmitting = false;
        this.loadRoutes(); // Reload list
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
