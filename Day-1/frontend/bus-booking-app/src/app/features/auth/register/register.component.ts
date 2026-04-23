import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  template: `
    <div class="register-page">
      <!-- High-quality Background Image -->
      <div class="page-bg-overlay">
        <img src="bus_travel_login_bg_1776928700742.png" alt="Bus background" class="bg-img">
        <div class="dark-gradient"></div>
      </div>

      <div class="register-container">
        <div class="register-card animate-fade-in-up">
          <div class="card-header">
            <div class="icon-circle">
              <mat-icon>person_add</mat-icon>
            </div>
            <h1>Create Account</h1>
            <p>Join BusReserve today for seamless travel</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-field">
              <label>FULL NAME</label>
              <mat-form-field appearance="outline">
                <mat-icon matPrefix>person_outline</mat-icon>
                <input matInput formControlName="name" placeholder="John Doe">
              </mat-form-field>
            </div>

            <div class="form-field">
              <label>EMAIL ADDRESS</label>
              <mat-form-field appearance="outline">
                <mat-icon matPrefix>mail_outline</mat-icon>
                <input matInput type="email" formControlName="email" placeholder="you@example.com">
              </mat-form-field>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>PHONE</label>
                <mat-form-field appearance="outline">
                  <mat-icon matPrefix>phone_android</mat-icon>
                  <input matInput type="tel" formControlName="phone" placeholder="9876543210">
                </mat-form-field>
              </div>
              <div class="form-field">
                <label>ACCOUNT TYPE</label>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="role">
                    <mat-option value="customer">Passenger</mat-option>
                    <mat-option value="operator">Operator</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <div class="form-field">
              <label>PASSWORD</label>
              <mat-form-field appearance="outline">
                <mat-icon matPrefix>lock_outline</mat-icon>
                <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••">
                <button type="button" mat-icon-button matSuffix (click)="showPassword = !showPassword">
                  <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>
            </div>

            <button type="submit" class="register-submit-btn" [disabled]="registerForm.invalid || isLoading">
              @if (isLoading) {
                <span class="loader"></span>
              } @else {
                <span>CREATE ACCOUNT</span>
              }
            </button>
          </form>

          <div class="card-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      position: relative;
      min-height: calc(100vh - var(--header-height));
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-2xl) var(--space-lg);
      overflow: hidden;
    }

    /* Background Styles */
    .page-bg-overlay {
      position: absolute;
      inset: 0;
      z-index: 0;
      .bg-img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.05); }
      .dark-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
      }
    }

    .register-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 520px;
    }

    .register-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: var(--space-xl) var(--space-xl);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .card-header {
      text-align: center;
      margin-bottom: var(--space-lg);
      .icon-circle {
        width: 56px; height: 56px;
        background: var(--primary-red-dim);
        color: var(--primary-red);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px auto;
        mat-icon { font-size: 28px; width: 28px; height: 28px; }
      }
      h1 { font-size: 1.6rem; font-weight: 800; margin: 0 0 4px 0; color: var(--text-main); }
      p { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: var(--space-md);
      @media (max-width: 500px) { grid-template-columns: 1fr; }
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      label { font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.5px; }
    }

    mat-form-field {
      width: 100%;
      ::ng-deep .mat-mdc-text-field-wrapper { background-color: white !important; }
    }

    .register-submit-btn {
      margin-top: 8px;
      background: var(--primary-red);
      color: white;
      border: none;
      height: 50px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 8px 16px var(--primary-red-dim);
      &:hover:not(:disabled) {
        background: var(--primary-red-hover);
        transform: translateY(-2px);
        box-shadow: 0 12px 24px var(--primary-red-dim);
      }
      &:disabled { opacity: 0.7; cursor: not-allowed; }
    }

    .card-footer {
      text-align: center;
      margin-top: var(--space-lg);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--border-color);
      p { color: var(--text-secondary); font-size: 0.85rem; margin: 0; }
      a { font-weight: 700; color: var(--primary-red); &:hover { text-decoration: underline; } }
    }

    .loader {
      width: 18px; height: 18px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      display: inline-block;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out both; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isLoading = false;
  showPassword = false;

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['customer', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.role === 'operator') {
          this.toastr.success('Registration successful! Please wait for admin approval.');
          this.authService.logout(); // Operator needs approval
          this.router.navigate(['/login']);
        } else {
          this.toastr.success('Registered successfully!');
          this.router.navigate(['/search']);
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
