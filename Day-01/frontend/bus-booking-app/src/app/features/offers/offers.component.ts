import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="offers-page">
      <div class="page-header">
        <h1>Travel Offers</h1>
        <p>Use these sample promo codes during your checkout flow while the payment gateway is in sandbox mode.</p>
      </div>

      <div class="offers-list">
        <article class="offer-card primary">
          <div>
            <span class="eyebrow">Save up to</span>
            <h2>Rs. 250 off</h2>
            <p>Applicable on selected routes above Rs. 999.</p>
          </div>
          <span class="code">BUS250</span>
        </article>

        <article class="offer-card">
          <div>
            <span class="eyebrow">Card offer</span>
            <h2>10% cashback</h2>
            <p>Use eligible bank cards for cashback on your next journey.</p>
          </div>
          <span class="code">ICICI10</span>
        </article>

        <article class="offer-card">
          <div>
            <span class="eyebrow">New users</span>
            <h2>First ride bonus</h2>
            <p>Special welcome offer for first-time passengers.</p>
          </div>
          <span class="code">NEWUSER</span>
        </article>
      </div>

      <a routerLink="/" class="search-link">
        <mat-icon>search</mat-icon>
        Search buses
      </a>
    </section>
  `,
  styles: [`
    .offers-page {
      max-width: 920px;
      margin: 0 auto;
      padding: var(--space-2xl) var(--space-lg);
    }

    .page-header {
      margin-bottom: var(--space-xl);
      h1 { font-size: 2rem; margin: 0 0 8px; }
      p { color: var(--text-secondary); margin: 0; }
    }

    .offers-list {
      display: grid;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .offer-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-lg);
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: var(--space-xl);

      &.primary { border-color: var(--primary-red); }
      .eyebrow { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; font-weight: 700; }
      h2 { margin: 4px 0; font-size: 1.4rem; }
      p { margin: 0; color: var(--text-secondary); }
      .code {
        border: 1px dashed var(--primary-red);
        color: var(--primary-red);
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        font-weight: 800;
        white-space: nowrap;
      }
    }

    .search-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: white;
      background: var(--primary-red);
      padding: 12px 18px;
      border-radius: var(--radius-sm);
      font-weight: 700;
    }
  `]
})
export class OffersComponent {}
