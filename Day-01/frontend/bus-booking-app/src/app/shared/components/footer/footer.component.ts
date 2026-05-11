import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <!-- Brand Col -->
        <div class="footer-col brand-col">
          <h3 class="footer-logo">BusReserve</h3>
          <p class="brand-text">
            The world's leading bus ticket booking platform with a focus on ease and reliability.
          </p>
        </div>

        <!-- Top Regions -->
        <div class="footer-col">
          <h4 class="col-title">Top Regions</h4>
          <ul class="footer-links">
            <li><a href="#">India</a></li>
            <li><a href="#">Singapore</a></li>
            <li><a href="#">Malaysia</a></li>
            <li><a href="#">Indonesia</a></li>
          </ul>
        </div>

        <!-- About -->
        <div class="footer-col">
          <h4 class="col-title">About</h4>
          <ul class="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Mobile App</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-col">
          <h4 class="col-title">Legal</h4>
          <ul class="footer-links">
            <li><a routerLink="/terms">Terms of Service</a></li>
            <li><a routerLink="/privacy">Privacy Policy</a></li>
            <li><a routerLink="/refund">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 BusReserve. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-light);
      border-top: 1px solid var(--border-color);
      padding-top: var(--space-3xl);
    }

    .footer-inner {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: 0 var(--space-lg) var(--space-3xl);
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: var(--space-2xl);
    }

    .footer-logo {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: var(--space-md);
    }

    .brand-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
      max-width: 260px;
    }

    .col-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: var(--space-lg);
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;

      a {
        color: var(--text-secondary);
        font-size: 0.9rem;
        &:hover { color: var(--primary-red); }
      }
    }

    .footer-bottom {
      text-align: center;
      padding: var(--space-lg);
      border-top: 1px solid var(--border-color);
      p { margin: 0; color: var(--text-secondary); font-size: 0.85rem; }
    }

    @media (max-width: 768px) {
      .footer-inner {
        grid-template-columns: 1fr 1fr;
      }
      .brand-col {
        grid-column: 1 / -1;
      }
    }
  `]
})
export class FooterComponent {}
