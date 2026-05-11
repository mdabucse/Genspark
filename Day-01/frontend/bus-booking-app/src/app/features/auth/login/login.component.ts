import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-page">
      <div class="page-bg-overlay">
        <div class="bg-pattern"></div>
      </div>

      <div class="login-container">
        <div class="login-card animate-fade-in-up">
          <div class="card-header">
            <div class="icon-circle">
              <mat-icon>directions_bus</mat-icon>
            </div>
            <h1>Welcome Back</h1>
            <p>Log in to manage your bus tickets and profile</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-field">
              <label>EMAIL ADDRESS</label>
              <mat-form-field appearance="outline">
                <mat-icon matPrefix>mail_outline</mat-icon>
                <input matInput type="email" formControlName="email" placeholder="you@example.com">
                @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-field">
              <div class="label-row">
                <label>PASSWORD</label>
                <a href="#" class="forgot-link">Forgot?</a>
              </div>
              <mat-form-field appearance="outline">
                <mat-icon matPrefix>lock_outline</mat-icon>
                <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••">
                <button type="button" mat-icon-button matSuffix (click)="showPassword = !showPassword">
                  <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                }
              </mat-form-field>
            </div>

            <button type="submit" class="login-submit-btn" [disabled]="loginForm.invalid || isLoading">
              @if (isLoading) {
                <span class="loader"></span>
              } @else {
                <span>SIGN IN</span>
              }
            </button>
          </form>

          <div class="card-footer">
            <p>New to BusReserve? <a routerLink="/register">Create an account</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      position: relative;
      min-height: calc(100vh - var(--header-height));
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl) var(--space-lg);
      overflow: hidden;
    }

    .page-bg-overlay {
      position: absolute;
      inset: 0;
      z-index: 0;

      .bg-pattern {
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(135deg, rgba(225,29,72,0.06) 0%, transparent 50%),
          linear-gradient(225deg, rgba(8,145,178,0.06) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(225,29,72,0.08), transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(8,145,178,0.08), transparent 40%),
          var(--bg-main);
      }
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
    }

    .login-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: var(--space-2xl) var(--space-xl);
      box-shadow: var(--shadow-lg);
    }

    .card-header {
      text-align: center;
      margin-bottom: var(--space-xl);

      .icon-circle {
        width: 60px;
        height: 60px;
        background: var(--primary-red-dim);
        color: var(--primary-red);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;
        mat-icon { font-size: 28px; width: 28px; height: 28px; }
      }

      h1 {
        font-size: 1.7rem;
        font-weight: 800;
        margin: 0 0 8px 0;
        color: var(--text-main);
      }

      p {
        color: var(--text-muted);
        font-size: 0.92rem;
        margin: 0;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-secondary);
        letter-spacing: 1px;
      }

      .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .forgot-link {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary-red);
        }
      }
    }

    mat-form-field {
      width: 100%;
      ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: #fafbfc !important;
      }
    }

    .login-submit-btn {
      margin-top: 8px;
      background: var(--primary-red);
      color: white;
      border: none;
      height: 52px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 16px rgba(225,29,72,0.25);

      &:hover:not(:disabled) {
        background: var(--primary-red-hover);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(225,29,72,0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .card-footer {
      text-align: center;
      margin-top: var(--space-xl);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--border-color);

      p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;
      }

      a {
        font-weight: 700;
        color: var(--primary-red);
        &:hover { text-decoration: underline; }
      }
    }

    .loader {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      display: inline-block;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isLoading = false;
  showPassword = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Logged in successfully!');
        switch (res.role) {
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'operator':
            this.router.navigate(['/operator']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
