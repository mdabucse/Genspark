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
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-xl) var(--space-lg);
    }

    .profile-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 40px;

      .avatar-circle {
        width: 100px;
        height: 100px;
        background: #f8fafc;
        border: 1px solid var(--border-color);
        color: var(--primary-red);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px auto;
        box-shadow: var(--shadow-sm);
        mat-icon { font-size: 48px; width: 48px; height: 48px; }
      }

      h1 { font-size: 2.2rem; font-weight: 800; margin: 0 0 4px 0; color: var(--text-main); }
      p { color: var(--text-muted); margin: 0; font-size: 1rem; font-weight: 500; }
    }

    .gradient-text {
      color: var(--primary-red);
    }

    .profile-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 32px;
      box-shadow: var(--shadow-md);
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 0.75rem;
        font-weight: 800;
        color: var(--text-muted);
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }
    }

    .readonly-field {
      ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: #f8fafc !important;
        cursor: not-allowed;
      }
      input { color: var(--text-muted) !important; font-weight: 600; }
    }

    .form-actions {
      margin-top: 12px;
      display: flex;
    }

    .save-btn {
      width: 100%;
      height: 54px;
      background: var(--primary-red);
      color: white;
      border: none;
      border-radius: var(--radius-full);
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 14px rgba(225,29,72,0.25);

      &:hover:not(:disabled) {
        background: var(--primary-red-hover);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(225,29,72,0.35);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        filter: grayscale(1);
      }

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .loader {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      display: inline-block;
      animation: spinSlow 0.8s linear infinite;
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
