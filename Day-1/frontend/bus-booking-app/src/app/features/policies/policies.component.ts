import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="policy-page">
      <div class="policy-header animate-fade-in-up">
        <h1>{{ title }}</h1>
        <p>Last updated: April 2026</p>
      </div>

      <div class="policy-content animate-fade-in-up stagger-1">
        @if (currentPolicy === 'terms') {
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using BusReserve, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement.</p>
            
            <h2>2. User Accounts</h2>
            <p>To use our booking services, you must register for an account. You are responsible for maintaining the confidentiality of your account and password.</p>
            
            <h2>3. Booking and Payment</h2>
            <p>All bookings are subject to seat availability. The seat is temporarily blocked for 5 minutes during the payment process. If payment fails, the seat lock is automatically released.</p>
          </section>
        } @else if (currentPolicy === 'privacy') {
          <section>
            <h2>1. Information Collection</h2>
            <p>We collect personal information such as your name, email address, and phone number when you register for an account or book a ticket. Payment details are securely processed by our third-party payment gateways.</p>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to process your bookings, communicate with you regarding your trips, and send promotional offers (if opted in).</p>
            
            <h2>3. Data Protection</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is encrypted in transit and at rest.</p>
          </section>
        } @else if (currentPolicy === 'refund') {
          <section>
            <h2>1. Cancellation Window</h2>
            <p>Tickets can only be cancelled up to 24 hours prior to the scheduled departure time of the bus. Cancellations are not permitted within 24 hours of departure.</p>
            
            <h2>2. Refund Processing</h2>
            <p>If you cancel your ticket within the allowed window, the refund amount will be credited back to your original payment method within 5-7 business days. A cancellation fee of 10% of the base fare may apply.</p>
            
            <h2>3. Operator Cancellations</h2>
            <p>If a bus trip is cancelled by the operator for unforeseen reasons, you are entitled to a full 100% refund without any cancellation fees.</p>
          </section>
        }
      </div>
    </div>
  `,
  styles: [`
    .policy-page {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--space-3xl) var(--space-lg);
      min-height: calc(100vh - var(--header-height));
    }

    .policy-header {
      text-align: center;
      margin-bottom: var(--space-3xl);
      padding-bottom: var(--space-xl);
      border-bottom: 1px solid var(--border-color);

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: var(--space-sm);
      }

      p {
        color: var(--text-secondary);
        font-size: 0.95rem;
        margin: 0;
      }
    }

    .policy-content {
      background: white;
      padding: var(--space-2xl);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);

      section {
        display: flex;
        flex-direction: column;
        gap: var(--space-xl);
      }

      h2 {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--text-main);
        margin: 0 0 var(--space-sm) 0;
      }

      p {
        font-size: 1rem;
        line-height: 1.7;
        color: var(--text-secondary);
        margin: 0;
      }
    }
  `]
})
export class PoliciesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  currentPolicy: 'terms' | 'privacy' | 'refund' = 'terms';
  title = 'Terms & Conditions';

  ngOnInit() {
    this.route.url.subscribe(segments => {
      const path = segments[0]?.path;
      if (path === 'privacy') {
        this.currentPolicy = 'privacy';
        this.title = 'Privacy Policy';
      } else if (path === 'refund') {
        this.currentPolicy = 'refund';
        this.title = 'Cancellation & Refund Policy';
      } else {
        this.currentPolicy = 'terms';
        this.title = 'Terms & Conditions';
      }
    });
  }
}
