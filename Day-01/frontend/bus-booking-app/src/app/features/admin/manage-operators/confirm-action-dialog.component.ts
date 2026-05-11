import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-action-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  template: `
    <div class="confirm-dialog">
      <h2 mat-dialog-title>Confirm Action</h2>
      <mat-dialog-content>
        <p>This is a sensitive administrative action. Please enter your administrator password to confirm.</p>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Admin Password</mat-label>
          <input matInput type="password" [(ngModel)]="password" placeholder="Enter your password">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-raised-button color="warn" [disabled]="!password" (click)="confirm()">
          Confirm Action
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog { padding: 8px; }
    .full-width { width: 100%; margin-top: 10px; }
  `]
})
export class ConfirmActionDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmActionDialogComponent>);
  password = '';

  confirm() {
    this.dialogRef.close(this.password);
  }

  cancel() {
    this.dialogRef.close();
  }
}
