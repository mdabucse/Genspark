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
          <mat-icon class="logo-icon">directions_bus</mat-icon>
          <span>BusReserve</span>
        </a>

        <!-- Center Nav -->
        <nav class="center-nav">
          @if (authService.isLoggedIn && userRole === 'admin') {
            <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
            <a routerLink="/admin/routes" routerLinkActive="active">Routes</a>
            <a routerLink="/admin/operators" routerLinkActive="active">Operators</a>
          } @else if (authService.isLoggedIn && userRole === 'operator') {
            <a routerLink="/operator" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
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
              <div class="avatar">{{ userInitial }}</div>
              <span>{{ userName }}</span>
              <mat-icon class="arrow">expand_more</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu" class="user-dropdown">
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person_outline</mat-icon>
                <span>My Profile</span>
              </button>
              <button mat-menu-item routerLink="/dashboard">
                <mat-icon>history</mat-icon>
                <span>My Bookings</span>
              </button>
              <button mat-menu-item (click)="logout()" class="logout-item">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          } @else {
            <a routerLink="/login" class="login-btn">
              <mat-icon>login</mat-icon>
              Sign In
            </a>
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
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px) saturate(1.6);
      -webkit-backdrop-filter: blur(20px) saturate(1.6);
      border-bottom: 1px solid var(--border-color);
      z-index: 1000;
      transition: box-shadow 0.3s ease;
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
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      transition: opacity 0.2s;

      &:hover { opacity: 0.85; }

      .logo-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: var(--primary-red);
      }

      span {
        font-family: var(--font-display);
        font-size: 1.4rem;
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.5px;
      }
    }

    .center-nav {
      display: flex;
      gap: 4px;

      a {
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.9rem;
        position: relative;
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;

        &:hover {
          color: var(--text-main);
          background: rgba(0,0,0,0.03);
        }

        &.active {
          color: var(--primary-red);
          background: var(--primary-red-dim);
          font-weight: 600;
        }
      }
    }

    .right-nav {
      display: flex;
      align-items: center;
    }

    .login-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      background: var(--primary-red);
      color: white;
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.88rem;
      text-decoration: none;
      transition: all var(--transition-base);
      box-shadow: 0 2px 10px rgba(225, 29, 72, 0.2);

      &:hover {
        background: var(--primary-red-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(225, 29, 72, 0.3);
        color: white;
      }

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-main);
      font-family: var(--font-body);
      font-weight: 500;
      font-size: 0.88rem;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      transition: all 0.2s ease;

      &:hover {
        background: rgba(0,0,0,0.03);
        border-color: rgba(0,0,0,0.12);
      }

      .arrow {
        color: var(--text-muted);
        font-size: 18px;
        width: 18px;
        height: 18px;
        transition: transform 0.2s;
      }
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary-red);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.75rem;
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
  get userInitial() { return (this.userName[0] || 'U').toUpperCase(); }

  logout() {
    this.authService.logout();
  }
}
