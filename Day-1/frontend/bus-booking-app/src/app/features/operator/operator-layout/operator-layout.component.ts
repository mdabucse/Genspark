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
            <mat-icon>local_shipping</mat-icon>
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
      height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
    }
    .sidenav-container {
      flex: 1;
    }
    .sidenav {
      width: 250px;
      background-color: #1a3a4a;
      color: white;
    }
    .sidenav-header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      h2 { margin: 10px 0 0 0; color: white; }
      mat-icon { font-size: 40px; width: 40px; height: 40px; }
    }
    ::ng-deep .sidenav .mat-mdc-list-item {
      color: #b8c7ce !important;
      .mdc-list-item__primary-text { color: #b8c7ce !important; }
      mat-icon { color: #b8c7ce !important; }
    }
    ::ng-deep .sidenav .mat-mdc-list-item:hover {
      background-color: #0d2530 !important;
      color: white !important;
      .mdc-list-item__primary-text { color: white !important; }
      mat-icon { color: white !important; }
    }
    ::ng-deep .sidenav .mat-mdc-list-item.active {
      background-color: #2196f3 !important;
      color: white !important;
      border-left: 4px solid #fff;
      .mdc-list-item__primary-text { color: white !important; font-weight: bold; }
      mat-icon { color: white !important; }
    }
    .back-home {
      margin-top: 40px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .content {
      padding: 24px;
      background-color: #f5f7fa;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class OperatorLayoutComponent {
}
