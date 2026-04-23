import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="profile-page">
      <div class="profile-container animate-fade-in-up">
        <div class="profile-header">
          <div class="avatar-circle">
            <mat-icon>person</mat-icon>
          </div>
          <h1>My <span class="gradient-text">Profile</span></h1>
          <p>View and manage your account details</p>
        </div>

        <div class="profile-card">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
            <div class="form-row">
              <div class="form-field">
                <label>FULL NAME</label>
                <mat-form-field appearance="outline">
                  <mat-icon matPrefix>person_outline</mat-icon>
                  <input matInput formControlName="name" placeholder="John Doe">
                  @if (profileForm.get('name')?.hasError('required')) {
                    <mat-error>Name is required</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="form-field">
                <label>EMAIL ADDRESS</label>
                <mat-form-field appearance="outline" class="readonly-field">
                  <mat-icon matPrefix>mail_outline</mat-icon>
                  <input matInput [value]="user?.email" readonly placeholder="email@example.com">
                  <mat-hint>Email cannot be changed</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>PHONE NUMBER</label>
                <mat-form-field appearance="outline">
                  <mat-icon matPrefix>phone_android</mat-icon>
                  <input matInput formControlName="phone" placeholder="9876543210">
                </mat-form-field>
              </div>

              <div class="form-field">
                <label>ACCOUNT TYPE</label>
                <mat-form-field appearance="outline" class="readonly-field">
                  <mat-icon matPrefix>badge</mat-icon>
                  <input matInput [value]="user?.role | titlecase" readonly>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" [disabled]="profileForm.invalid || isLoading || !profileForm.dirty">
                @if (isLoading) {
                  <span class="loader"></span>
                } @else {
                  <mat-icon>check</mat-icon>
                  <span>SAVE CHANGES</span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: var(--max-content);
      margin: 0 auto;
      padding: var(--space-2xl) var(--space-lg);
    }

    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      text-align: center;
      margin-bottom: var(--space-2xl);

      .avatar-circle {
        width: 80px;
        height: 80px;
        background: var(--primary-red-dim);
        color: var(--primary-red);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;
        mat-icon { font-size: 40px; width: 40px; height: 40px; }
      }

      h1 { font-size: 2rem; font-weight: 800; margin: 0 0 8px 0; }
      p { color: var(--text-secondary); margin: 0; }
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--primary-red), #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .profile-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: var(--space-2xl);
      box-shadow: var(--shadow-md);
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-xl);
      @media (max-width: 600px) { grid-template-columns: 1fr; gap: var(--space-md); }
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
    }

    .readonly-field {
      opacity: 0.8;
      ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: #f3f4f6 !important;
      }
    }

    .form-actions {
      margin-top: var(--space-lg);
      display: flex;
      justify-content: flex-end;
    }

    .save-btn {
      background: var(--primary-red);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 8px 16px var(--primary-red-dim);

      &:hover:not(:disabled) {
        background: var(--primary-red-hover);
        transform: translateY(-2px);
        box-shadow: 0 12px 24px var(--primary-red-dim);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
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

    @keyframes spin { to { transform: rotate(360deg); } }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out both;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  user: any;
  isLoading = false;
  profileForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['']
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
        this.profileForm.patchValue({
          name: res.name,
          phone: res.phone
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.isLoading = false;
        this.profileForm.markAsPristine();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
