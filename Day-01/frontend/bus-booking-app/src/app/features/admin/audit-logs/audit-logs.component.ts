import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService, AuditLog } from '../../../core/services/admin.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="audit-logs">
      <div class="page-title">
        <h1>Audit Logs</h1>
        <p>Track administrative actions and system changes</p>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3>Recent Actions</h3>
          <button class="refresh-btn" (click)="loadLogs()" [disabled]="isLoading">
            <mat-icon [class.spinning]="isLoading">refresh</mat-icon>
            Refresh
          </button>
        </div>

        @if (isLoading) {
          <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
        } @else {
          <div class="table-scroll">
            <table mat-table [dataSource]="logs" class="performance-table">
              <ng-container matColumnDef="action">
                <th mat-header-cell *matHeaderCellDef>Action</th>
                <td mat-cell *matCellDef="let log">
                  <div class="action-cell">
                    <span class="action-tag" [class]="getActionClass(log.action)">{{ log.action }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let log" class="desc-cell">{{ log.description }}</td>
              </ng-container>

              <ng-container matColumnDef="admin">
                <th mat-header-cell *matHeaderCellDef>Admin</th>
                <td mat-cell *matCellDef="let log">
                  <span class="admin-email">{{ log.adminEmail }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="timestamp">
                <th mat-header-cell *matHeaderCellDef>Timestamp</th>
                <td mat-cell *matCellDef="let log">
                  <div class="time-cell">
                    <strong>{{ log.createdAt | date:'shortDate' }}</strong>
                    <span>{{ log.createdAt | date:'shortTime' }}</span>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          @if (logs.length === 0) {
            <div class="empty-state">
              <mat-icon>history</mat-icon>
              <p>No audit logs found.</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .audit-logs {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .page-title {
      margin-bottom: 32px;
      h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 4px 0; color: var(--text-main); }
      p { color: var(--text-muted); font-size: 0.95rem; margin: 0; }
    }

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
      h3 { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; margin: 0; color: var(--text-main); }
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid var(--border-color);
      padding: 8px 16px;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s;
      &:hover { background: #f8fafc; border-color: #cbd5e1; color: var(--text-main); }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      .spinning { animation: rotate 1s linear infinite; }
    }

    @keyframes rotate { to { transform: rotate(360deg); } }

    .loading { display: flex; justify-content: center; padding: 60px 0; }

    .table-scroll { overflow-x: auto; }

    .performance-table {
      width: 100%;
      th {
        color: var(--text-muted);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.05em;
        padding: 16px 24px;
        background: #f8fafc;
        border-bottom: 1px solid var(--border-color);
      }
      td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: var(--text-main); }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #f8fafc; }
    }

    .action-tag {
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      
      &.block { background: #fee2e2; color: #b91c1c; }
      &.unblock { background: #dcfce7; color: #15803d; }
      &.approve { background: #e0f2fe; color: #0369a1; }
      &.reject { background: #ffedd5; color: #9a3412; }
      &.default { background: #f1f5f9; color: #475569; }
    }

    .desc-cell { font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
    .admin-email { font-size: 0.85rem; color: var(--text-main); font-weight: 600; }

    .time-cell {
      display: flex;
      flex-direction: column;
      strong { font-size: 0.85rem; color: var(--text-main); }
      span { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: var(--text-muted);
      mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.2; }
      p { margin: 0; font-size: 0.95rem; font-weight: 600; }
    }
  `]
})
export class AuditLogsComponent implements OnInit {
  private adminService = inject(AdminService);

  logs: AuditLog[] = [];
  isLoading = true;
  displayedColumns = ['action', 'description', 'admin', 'timestamp'];

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading = true;
    this.adminService.getAuditLogs().subscribe({
      next: (res) => {
        this.logs = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getActionClass(action: string): string {
    const a = action.toLowerCase();
    if (a.includes('block') && !a.includes('unblock')) return 'block';
    if (a.includes('unblock')) return 'unblock';
    if (a.includes('approve')) return 'approve';
    if (a.includes('reject')) return 'reject';
    return 'default';
  }
}
