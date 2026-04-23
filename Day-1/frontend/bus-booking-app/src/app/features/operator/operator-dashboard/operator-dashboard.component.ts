import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OperatorService, OperatorDashboardStats } from '../../../core/services/operator.service';

@Component({
  selector: 'app-operator-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="dashboard">
      <h1>Operator Dashboard</h1>

      @if (isLoading) {
        <div class="loading"><mat-spinner></mat-spinner></div>
      } @else if (stats) {
        <div class="stats-grid">
          <mat-card class="stat-card buses">
            <mat-icon>directions_bus</mat-icon>
            <div class="stat-info">
              <h3>{{ stats.totalBuses }}</h3>
              <p>Total Buses</p>
            </div>
          </mat-card>

          <mat-card class="stat-card trips">
            <mat-icon>schedule</mat-icon>
            <div class="stat-info">
              <h3>{{ stats.activeTrips }}</h3>
              <p>Active Trips</p>
            </div>
          </mat-card>

          <mat-card class="stat-card bookings">
            <mat-icon>book_online</mat-icon>
            <div class="stat-info">
              <h3>{{ stats.todayBookings }}</h3>
              <p>Today's Bookings</p>
            </div>
          </mat-card>

          <mat-card class="stat-card revenue">
            <mat-icon>currency_rupee</mat-icon>
            <div class="stat-info">
              <h3>₹{{ stats.totalRevenue | number:'1.0-0' }}</h3>
              <p>Total Revenue</p>
            </div>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; }
    h1 { margin-bottom: 24px; color: #333; }
    .loading { display: flex; justify-content: center; padding: 60px 0; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      padding: 24px;
      gap: 16px;
      border-radius: 12px;
      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        opacity: 0.9;
      }
    }
    .stat-card.buses { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .stat-card.trips { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; }
    .stat-card.bookings { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; }
    .stat-card.revenue { background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; }
    .stat-info {
      h3 { margin: 0; font-size: 28px; font-weight: 700; }
      p { margin: 4px 0 0 0; opacity: 0.9; font-size: 14px; }
    }
  `]
})
export class OperatorDashboardComponent implements OnInit {
  private operatorService = inject(OperatorService);

  stats: OperatorDashboardStats | null = null;
  isLoading = true;

  ngOnInit() {
    this.operatorService.getDashboard().subscribe({
      next: (data) => { this.stats = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }
}
