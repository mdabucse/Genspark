import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService, AdminDashboardStats } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="admin-dash">
      <div class="dash-header animate-fade-in-up">
        <h1>Dashboard <span class="gradient-text">Overview</span></h1>
        <p>{{ greeting }}, Admin</p>
      </div>

      @if (isLoading) {
        <div class="loading-state">
          <mat-spinner diameter="44"></mat-spinner>
        </div>
      } @else if (stats) {
        <div class="stats-grid">
          <div class="stat-card animate-fade-in-up stagger-1">
            <div class="stat-icon revenue-icon"><mat-icon>account_balance_wallet</mat-icon></div>
            <div class="stat-info">
              <span class="stat-label">Total Revenue</span>
              <span class="stat-value">₹{{ stats.totalRevenue | number:'1.0-0' }}</span>
            </div>
          </div>

          <div class="stat-card animate-fade-in-up stagger-2">
            <div class="stat-icon today-icon"><mat-icon>trending_up</mat-icon></div>
            <div class="stat-info">
              <span class="stat-label">Today's Revenue</span>
              <span class="stat-value">₹{{ stats.todayRevenue | number:'1.0-0' }}</span>
            </div>
          </div>

          <div class="stat-card animate-fade-in-up stagger-3">
            <div class="stat-icon users-icon"><mat-icon>group</mat-icon></div>
            <div class="stat-info">
              <span class="stat-label">Total Customers</span>
              <span class="stat-value">{{ stats.totalUsers }}</span>
            </div>
          </div>

          <div class="stat-card animate-fade-in-up stagger-4">
            <div class="stat-icon operators-icon"><mat-icon>directions_bus</mat-icon></div>
            <div class="stat-info">
              <span class="stat-label">Total Operators</span>
              <span class="stat-value">{{ stats.totalOperators }}</span>
            </div>
          </div>

          <div class="stat-card animate-fade-in-up stagger-5" [class.alert]="stats.pendingOperators > 0">
            <div class="stat-icon pending-icon"><mat-icon>pending_actions</mat-icon></div>
            <div class="stat-info">
              <span class="stat-label">Pending Approvals</span>
              <span class="stat-value">{{ stats.pendingOperators }}</span>
            </div>
            @if (stats.pendingOperators > 0) {
              <span class="alert-dot"></span>
            }
          </div>

          <div class="stat-card animate-fade-in-up stagger-6">
            <div class="stat-icon trips-icon"><mat-icon>departure_board</mat-icon></div>
            <div class="stat-info">
              <span class="stat-label">Trips Today</span>
              <span class="stat-value">{{ stats.tripsToday }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-dash {
      max-width: var(--max-content);
    }

    .dash-header {
      margin-bottom: var(--space-xl);
      h1 { font-size: 1.8rem; font-weight: 700; margin: 0 0 4px 0; }
      p { color: var(--text-secondary); margin: 0; font-size: 1rem; }
    }

    .gradient-text {
      background: linear-gradient(135deg, hsl(260, 80%, 65%), var(--accent-amber));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: var(--space-3xl) 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .stat-card {
      background: var(--surface-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.3);
      }

      &.alert {
        border-color: var(--danger);
        box-shadow: 0 0 20px hsla(0, 72%, 56%, 0.1);
      }
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 26px; width: 26px; height: 26px;
      }
    }

    .revenue-icon { background: var(--success-dim); mat-icon { color: var(--success); } }
    .today-icon { background: hsla(174, 100%, 42%, 0.12); mat-icon { color: var(--accent-teal); } }
    .users-icon { background: var(--info-dim); mat-icon { color: var(--info); } }
    .operators-icon { background: hsla(260, 80%, 60%, 0.12); mat-icon { color: hsl(260, 80%, 65%); } }
    .pending-icon { background: var(--warning-dim); mat-icon { color: var(--warning); } }
    .trips-icon { background: hsla(38, 100%, 62%, 0.12); mat-icon { color: var(--accent-amber); } }

    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    .stat-value {
      font-family: var(--font-display);
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .alert-dot {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--danger);
      animation: pulse 1.5s infinite;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats: AdminDashboardStats | null = null;
  isLoading = true;

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
