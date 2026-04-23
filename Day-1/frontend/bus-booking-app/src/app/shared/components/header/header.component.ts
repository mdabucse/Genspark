import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatMenuModule, MatIconModule],
  template: `
    <header class="header">
      <div class="header-inner">
        
        <!-- Logo -->
        <a class="logo" routerLink="/">
          BusReserve
        </a>

        <!-- Center Nav -->
        <nav class="center-nav">
          @if (authService.isLoggedIn && userRole === 'admin') {
            <a routerLink="/admin" routerLinkActive="active">Dashboard</a>
            <a routerLink="/admin/routes" routerLinkActive="active">Routes</a>
            <a routerLink="/admin/operators" routerLinkActive="active">Operators</a>
          } @else if (authService.isLoggedIn && userRole === 'operator') {
            <a routerLink="/operator" routerLinkActive="active">Dashboard</a>
            <a routerLink="/operator/buses" routerLinkActive="active">Buses</a>
            <a routerLink="/operator/trips" routerLinkActive="active">Trips</a>
          } @else {
            <a routerLink="/dashboard" routerLinkActive="active">Manage Booking</a>
            <a routerLink="/help" routerLinkActive="active">Help</a>
            <a routerLink="/offers" routerLinkActive="active">Offers</a>
          }
        </nav>

        <!-- Right Side -->
        <div class="right-nav">
          @if (authService.isLoggedIn) {
            <button class="user-btn" [matMenuTriggerFor]="userMenu">
              <mat-icon>person</mat-icon>
              <span>{{ userName }}</span>
              <mat-icon class="arrow">keyboard_arrow_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person_outline</mat-icon>
                <span>My Profile</span>
              </button>
              <button mat-menu-item routerLink="/dashboard">
                <mat-icon>history</mat-icon>
                <span>My Bookings</span>
              </button>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          } @else {
            <a routerLink="/login" class="btn-primary login-btn">Login / Sign Up</a>
          }
        </div>

      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--header-height);
      background: var(--bg-white);
      border-bottom: 1px solid var(--border-color);
      z-index: 1000;
    }

    .header-inner {
      max-width: var(--max-content);
      margin: 0 auto;
      height: 100%;
      padding: 0 var(--space-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-red);
      text-decoration: none;
      letter-spacing: -0.5px;
    }

    .center-nav {
      display: flex;
      gap: var(--space-2xl);

      a {
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.95rem;
        position: relative;
        padding: 8px 0;

        &:hover {
          color: var(--primary-red);
        }

        &.active {
          color: var(--primary-red);
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--primary-red);
          }
        }
      }
    }

    .right-nav {
      display: flex;
      align-items: center;
    }

    .login-btn {
      padding: 8px 20px;
      font-size: 0.9rem;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      color: var(--text-main);
      font-weight: 500;
      cursor: pointer;
      padding: 8px;
      border-radius: var(--radius-sm);
      &:hover { background: var(--bg-light); }
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      .arrow { color: var(--text-muted); }
    }

    @media (max-width: 768px) {
      .center-nav { display: none; }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);

  get userName() { return localStorage.getItem('name') || 'Account'; }
  get userRole() { return localStorage.getItem('role') || 'customer'; }

  logout() {
    this.authService.logout();
  }
}
