import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService, AdminDashboardStats, OperatorPerformance } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, MatTooltipModule],
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

        <div class="performance-section animate-fade-in-up delay-1">
          <div class="section-header">
            <div class="title-with-legend">
              <div>
                <h2>Operator <span class="gradient-text">Performance</span></h2>
                <p>Live revenue and booking metrics across all bus operators</p>
              </div>
              <div class="trip-legend glass-card">
                <div class="legend-item"><span class="dot active"></span> Active</div>
                <div class="legend-item"><span class="dot completed"></span> Completed</div>
                <div class="legend-item"><span class="dot cancelled"></span> Cancelled</div>
              </div>
            </div>
          </div>

          <div class="table-container glass-panel">
            <table mat-table [dataSource]="operatorStats" class="performance-table">
              
              <ng-container matColumnDef="operator">
                <th mat-header-cell *matHeaderCellDef> Operator </th>
                <td mat-cell *matCellDef="let op"> 
                  <div class="op-cell">
                    <span class="op-name">{{ op.name }}</span>
                    <span class="op-email">{{ op.email }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="buses">
                <th mat-header-cell *matHeaderCellDef> Buses </th>
                <td mat-cell *matCellDef="let op"> 
                  <span class="badge bus-badge">{{ op.busCount }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="bookings">
                <th mat-header-cell *matHeaderCellDef> Bookings </th>
                <td mat-cell *matCellDef="let op"> 
                  <div class="stat-cell">
                    <span class="main-val">{{ op.totalBookings }}</span>
                    <span class="sub-val">Tickets sold</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="revenue">
                <th mat-header-cell *matHeaderCellDef> Revenue </th>
                <td mat-cell *matCellDef="let op"> 
                  <span class="revenue-val">₹{{ op.totalRevenue | number:'1.0-0' }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="trips">
                <th mat-header-cell *matHeaderCellDef> Trip Status </th>
                <td mat-cell *matCellDef="let op"> 
                  <div class="trip-stats">
                    <div class="trip-dot active" matTooltip="Active: {{op.activeTrips}}"><span>{{op.activeTrips}}</span></div>
                    <div class="trip-dot completed" matTooltip="Completed: {{op.completedTrips}}"><span>{{op.completedTrips}}</span></div>
                    <div class="trip-dot cancelled" matTooltip="Cancelled: {{op.cancelledTrips}}"><span>{{op.cancelledTrips}}</span></div>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            @if (operatorStats.length === 0 && !isLoading) {
              <div class="empty-table">
                <mat-icon>analytics</mat-icon>
                <p>No operator data available yet</p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-dash {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .dash-header {
      margin-bottom: var(--space-xl);
      h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 4px 0; color: var(--text-main); }
      p { color: var(--text-muted); margin: 0; font-size: 0.95rem; }
    }

    .gradient-text { color: var(--primary-red); }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: var(--space-3xl) 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: rgba(0,0,0,0.1);
      }

      &.alert {
        border-color: var(--primary-red);
        background: #fff1f2;
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 24px; width: 24px; height: 24px;
      }
    }

    .revenue-icon { background: rgba(5,150,105,0.1); mat-icon { color: #059669; } }
    .today-icon { background: rgba(8,145,178,0.1); mat-icon { color: #0891b2; } }
    .users-icon { background: rgba(37,99,235,0.1); mat-icon { color: #2563eb; } }
    .operators-icon { background: rgba(124,58,237,0.1); mat-icon { color: #7c3aed; } }
    .pending-icon { background: rgba(245,158,11,0.1); mat-icon { color: #d97706; } }
    .trips-icon { background: rgba(234,88,12,0.1); mat-icon { color: #ea580c; } }

    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .stat-value {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .alert-dot {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary-red);
      animation: pulse 1.5s infinite;
    }

    .performance-section {
      margin-top: 40px;
    }

    .section-header {
      margin-bottom: 24px;
    }

    .title-with-legend {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      h2 { font-size: 1.4rem; font-weight: 800; margin: 0 0 2px 0; color: var(--text-main); }
      p { color: var(--text-muted); margin: 0; font-size: 0.9rem; }
    }

    .trip-legend {
      display: flex;
      gap: 16px;
      padding: 8px 16px;
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.active { background: #0891b2; }
        &.completed { background: #059669; }
        &.cancelled { background: #e11d48; }
      }
    }

    .glass-panel {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .performance-table {
      width: 100%;
      background: transparent;

      th {
        color: var(--text-muted);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.05em;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);
        background: #f8fafc;
      }

      td {
        padding: 16px 20px;
        border-bottom: 1px solid #f1f5f9;
        color: var(--text-main);
      }

      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #f8fafc; }
    }

    .op-cell {
      display: flex;
      flex-direction: column;
      .op-name { font-weight: 700; color: var(--text-main); font-size: 0.92rem; }
      .op-email { font-size: 0.8rem; color: var(--text-muted); }
    }

    .badge {
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .bus-badge { background: #f1f5f9; color: var(--text-main); border: 1px solid var(--border-color); }

    .stat-cell {
      display: flex;
      flex-direction: column;
      .main-val { font-weight: 700; color: var(--text-main); }
      .sub-val { font-size: 0.72rem; color: var(--text-muted); }
    }

    .revenue-val {
      font-family: var(--font-display);
      font-weight: 800;
      color: #059669;
      font-size: 1rem;
    }

    .trip-stats {
      display: flex;
      gap: 6px;
    }
    .trip-dot {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 800;
      
      &.active { background: rgba(8,145,178,0.1); color: #0891b2; }
      &.completed { background: rgba(5,150,105,0.1); color: #059669; }
      &.cancelled { background: rgba(225,29,72,0.1); color: #e11d48; }
    }

    .empty-table {
      padding: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-muted);
      mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.3; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats: AdminDashboardStats | null = null;
  operatorStats: OperatorPerformance[] = [];
  isLoading = true;
  displayedColumns = ['operator', 'buses', 'bookings', 'revenue', 'trips'];

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
        this.fetchOperatorPerformance();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  fetchOperatorPerformance() {
    this.adminService.getOperatorPerformance().subscribe({
      next: (data) => {
        this.operatorStats = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
