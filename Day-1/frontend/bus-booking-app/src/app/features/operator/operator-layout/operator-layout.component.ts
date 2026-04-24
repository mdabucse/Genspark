import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-operator-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule],
  template: `
    <div class="operator-container">
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav mode="side" opened class="sidenav">
          <div class="sidenav-header">
            <div class="portal-badge">
              <mat-icon>local_shipping</mat-icon>
            </div>
            <h2>Operator Portal</h2>
          </div>
          <mat-nav-list>
            <a mat-list-item routerLink="/operator" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/operator/buses" routerLinkActive="active">
              <mat-icon matListItemIcon>directions_bus</mat-icon>
              <span matListItemTitle>My Buses</span>
            </a>
            <a mat-list-item routerLink="/operator/trips" routerLinkActive="active">
              <mat-icon matListItemIcon>schedule</mat-icon>
              <span matListItemTitle>Schedule Trips</span>
            </a>
            <a mat-list-item routerLink="/operator/bookings" routerLinkActive="active">
              <mat-icon matListItemIcon>book_online</mat-icon>
              <span matListItemTitle>Bookings</span>
            </a>
            <a mat-list-item routerLink="/" class="back-home">
              <mat-icon matListItemIcon>home</mat-icon>
              <span matListItemTitle>Back to Site</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        
        <mat-sidenav-content class="content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .operator-container {
      height: calc(100vh - var(--header-height));
      display: flex;
      flex-direction: column;
    }
    .sidenav-container {
      flex: 1;
    }
    .sidenav {
      width: 240px;
      background: #0f1729;
      color: white;
      border-right: none !important;
    }
    .sidenav-header {
      padding: 28px 20px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.06);

      .portal-badge {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--primary-red), #fb7185);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(225, 29, 72, 0.3);
        mat-icon { font-size: 24px; width: 24px; height: 24px; color: white; }
      }

      h2 {
        margin: 0;
        color: rgba(255,255,255,0.9);
        font-family: var(--font-display);
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.02em;
      }
    }

    ::ng-deep .sidenav .mat-mdc-list-item {
      margin: 2px 8px;
      border-radius: 10px !important;
      color: rgba(255,255,255,0.55) !important;
      transition: all 0.2s ease !important;

      .mdc-list-item__primary-text { 
        color: rgba(255,255,255,0.55) !important; 
        font-family: var(--font-body) !important;
        font-size: 0.88rem !important;
        font-weight: 500 !important;
      }
      mat-icon { 
        color: rgba(255,255,255,0.35) !important; 
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
      }
    }
    ::ng-deep .sidenav .mat-mdc-list-item:hover {
      background-color: rgba(255,255,255,0.06) !important;
      color: white !important;
      .mdc-list-item__primary-text { color: white !important; }
      mat-icon { color: rgba(255,255,255,0.8) !important; }
    }
    ::ng-deep .sidenav .mat-mdc-list-item.active {
      background: rgba(225, 29, 72, 0.15) !important;
      color: white !important;
      border-left: 3px solid var(--primary-red) !important;
      .mdc-list-item__primary-text { color: white !important; font-weight: 600 !important; }
      mat-icon { color: var(--primary-red) !important; }
    }
    .back-home {
      margin-top: 32px !important;
    }
    .content {
      padding: 28px 32px;
      background-color: #f8f9fc;
      min-height: calc(100vh - var(--header-height));
    }
  `]
})
export class OperatorLayoutComponent {
}
