import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule],
  template: `
    <div class="portal-container">
      <aside class="sidebar">
        <!-- Brand -->
        <div class="sidebar-brand">
          <div class="brand-icon">
            <mat-icon>shield</mat-icon>
          </div>
          <div class="brand-text">
            <span class="brand-name">Admin</span>
            <span class="brand-sub">Control Center</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>speed</mat-icon>
            <span>Dashboard</span>
          </a>
          <a class="nav-item" routerLink="/admin/routes" routerLinkActive="active">
            <mat-icon>add_road</mat-icon>
            <span>Manage Routes</span>
          </a>
          <a class="nav-item" routerLink="/admin/operators" routerLinkActive="active">
            <mat-icon>manage_accounts</mat-icon>
            <span>Manage Operators</span>
          </a>
        </nav>

        <!-- Bottom -->
        <div class="sidebar-bottom">
          <a class="nav-item back" routerLink="/">
            <mat-icon>arrow_back</mat-icon>
            <span>Back to Site</span>
          </a>
        </div>
      </aside>

      <main class="portal-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .portal-container {
      display: flex;
      min-height: calc(100vh - var(--header-height));
    }

    .sidebar {
      width: var(--sidebar-width);
      background: var(--surface-card);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: var(--header-height);
      height: calc(100vh - var(--header-height));
      overflow-y: auto;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-xl) var(--space-lg);
      border-bottom: 1px solid var(--glass-border);
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, hsl(260, 80%, 55%), hsl(280, 70%, 50%));
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon {
        font-size: 22px; width: 22px; height: 22px;
        color: white;
      }
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .brand-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-md) var(--space-sm);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: 12px var(--space-md);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-family: var(--font-display);
      font-weight: 500;
      font-size: 0.9rem;
      transition: all var(--transition-base);

      mat-icon {
        font-size: 20px; width: 20px; height: 20px;
      }

      &:hover {
        background: var(--surface-elevated);
        color: var(--text-primary);
      }

      &.active {
        background: hsla(260, 80%, 55%, 0.12);
        color: hsl(260, 80%, 65%);
        font-weight: 600;

        mat-icon {
          color: hsl(260, 80%, 65%);
        }
      }
    }

    .sidebar-bottom {
      padding: var(--space-md) var(--space-sm);
      border-top: 1px solid var(--glass-border);

      .back {
        color: var(--text-muted);
        &:hover { color: var(--text-primary); }
      }
    }

    .portal-content {
      flex: 1;
      padding: var(--space-xl);
      background: var(--surface-base);
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 60px;
        .brand-text, .nav-item span { display: none; }
        .sidebar-brand { justify-content: center; padding: var(--space-md); }
        .nav-item { justify-content: center; padding: 12px; }
      }
    }
  `]
})
export class AdminLayoutComponent {
}
