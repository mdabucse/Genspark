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
      <div class="page-title">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your business overview.</p>
      </div>

      @if (isLoading) {
        <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
      } @else if (stats) {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon buses"><mat-icon>directions_bus</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalBuses }}</span>
              <span class="stat-label">Total Buses</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon trips"><mat-icon>schedule</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.activeTrips }}</span>
              <span class="stat-label">Active Trips</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon bookings"><mat-icon>book_online</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.todayBookings }}</span>
              <span class="stat-label">Today's Bookings</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue"><mat-icon>currency_rupee</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">₹{{ stats.totalRevenue | number:'1.0-0' }}</span>
              <span class="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .page-title {
      margin-bottom: 32px;
      h1 {
        font-size: 1.8rem;
        font-weight: 800;
        margin: 0 0 4px 0;
        color: var(--text-main);
      }
      p {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin: 0;
      }
    }

    .loading { display: flex; justify-content: center; padding: 60px 0; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: rgba(0,0,0,0.1);
      }
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon { font-size: 24px; width: 24px; height: 24px; }

      &.buses { background: rgba(37, 99, 235, 0.1); mat-icon { color: #2563eb; } }
      &.trips { background: rgba(124, 58, 237, 0.1); mat-icon { color: #7c3aed; } }
      &.bookings { background: rgba(8, 145, 178, 0.1); mat-icon { color: #0891b2; } }
      &.revenue { background: rgba(5, 150, 105, 0.1); mat-icon { color: #059669; } }
    }

    .stat-info {
      display: flex;
      flex-direction: column;

      .stat-value {
        font-family: var(--font-display);
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--text-main);
        line-height: 1.2;
      }
      .stat-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 2px;
      }
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
