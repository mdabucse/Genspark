import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="help-page">
      <div class="page-header">
        <h1>How can we help?</h1>
        <p>Quick answers for booking, payment, cancellation, and operator account questions.</p>
      </div>

      <div class="help-grid">
        <article class="help-card">
          <mat-icon>confirmation_number</mat-icon>
          <h2>Booking Support</h2>
          <p>Review your trip details, download tickets, and manage upcoming bookings from your dashboard.</p>
          <a routerLink="/dashboard">Open My Bookings</a>
        </article>

        <article class="help-card">
          <mat-icon>event_seat</mat-icon>
          <h2>Seat Locking</h2>
          <p>Selected seats are held for 5 minutes while passenger and payment details are completed.</p>
        </article>

        <article class="help-card">
          <mat-icon>currency_rupee</mat-icon>
          <h2>Payments & Refunds</h2>
          <p>Successful payments confirm the booking immediately. Cancelled eligible trips release seats and mark the booking cancelled.</p>
        </article>

        <article class="help-card">
          <mat-icon>support_agent</mat-icon>
          <h2>Need More Help?</h2>
          <p>Contact support with your booking reference, email, route, and travel date for faster resolution.</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .help-page {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: var(--space-2xl) var(--space-lg);
    }

    .page-header {
      margin-bottom: var(--space-xl);
      h1 { font-size: 2rem; margin: 0 0 8px; }
      p { color: var(--text-secondary); margin: 0; }
    }

    .help-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--space-lg);
    }

    .help-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: var(--space-xl);

      mat-icon { color: var(--primary-red); margin-bottom: var(--space-md); }
      h2 { font-size: 1.1rem; margin: 0 0 8px; }
      p { color: var(--text-secondary); line-height: 1.6; margin: 0; }
      a { display: inline-block; margin-top: var(--space-md); font-weight: 600; color: var(--primary-red); }
    }
  `]
})
export class HelpComponent {}
