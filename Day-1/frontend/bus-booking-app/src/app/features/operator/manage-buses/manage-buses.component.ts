import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OperatorService, BusData, SeatLayoutDto } from '../../../core/services/operator.service';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-manage-buses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatChipsModule, MatProgressSpinnerModule, MatStepperModule, MatButtonToggleModule, MatCheckboxModule],
  template: `
    <div class="manage-buses">
      <div class="page-title">
        <h1>My Buses</h1>
        <p>Add, manage, and design your fleet</p>
      </div>

      <mat-card class="registration-stepper-card">
        <mat-horizontal-stepper #stepper linear>
          <!-- Step 1: Bus Details -->
          <mat-step [stepControl]="busForm">
            <ng-template matStepLabel>Bus Details</ng-template>
            <div class="step-content">
              <div class="form-card-header">
                <mat-icon>add_circle_outline</mat-icon>
                <h3>Register New Bus</h3>
              </div>
              <form [formGroup]="busForm" class="bus-form">
                <mat-form-field appearance="outline">
                  <mat-label>Bus Number</mat-label>
                  <input matInput formControlName="busNumber" placeholder="e.g. TN01AB1234">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Bus Name</mat-label>
                  <input matInput formControlName="busName" placeholder="e.g. Super Express">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Capacity</mat-label>
                  <input matInput type="number" formControlName="capacity" min="1" max="50">
                  <mat-hint>Actual capacity from layout will be used</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Bus Type</mat-label>
                  <mat-select formControlName="busType">
                    <mat-option value="AC Sleeper">AC Sleeper</mat-option>
                    <mat-option value="AC Semi-Sleeper">AC Semi-Sleeper</mat-option>
                    <mat-option value="Non-AC Sleeper">Non-AC Sleeper</mat-option>
                    <mat-option value="Non-AC Seater">Non-AC Seater</mat-option>
                    <mat-option value="Volvo Multi-Axle">Volvo Multi-Axle</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Initial Layout Style</mat-label>
                  <mat-select formControlName="seatLayout">
                    <mat-option value="2x2">2x2 Seater</mat-option>
                    <mat-option value="2x1">2x1 Seater</mat-option>
                    <mat-option value="1x1">1x1 Sleeper</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="stepper-actions">
                  <button type="button" mat-raised-button color="primary" matStepperNext (click)="prepareLayout()">
                    Continue to Design Layout
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </div>
          </mat-step>

          <!-- Step 2: Layout Designer -->
          <mat-step>
            <ng-template matStepLabel>Seat Layout</ng-template>
            <div class="step-content">
              <div class="designer-section">
                <div class="designer-sidebar">
                  <div class="config-group">
                    <mat-form-field appearance="outline" class="mini-field">
                      <mat-label>Rows</mat-label>
                      <input matInput type="number" [(ngModel)]="designRows" (change)="onDesignGridChange()">
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="mini-field">
                      <mat-label>Cols</mat-label>
                      <input matInput type="number" [(ngModel)]="designCols" (change)="onDesignGridChange()">
                    </mat-form-field>
                  </div>
                  
                  <mat-checkbox [(ngModel)]="designHasUpperDeck">Include Upper Deck</mat-checkbox>
                  
                  <button mat-stroked-button color="accent" class="full-width mt-2" (click)="autoGenerateLayout()">
                    <mat-icon>auto_awesome</mat-icon>
                    Auto-Generate
                  </button>

                  <div class="stats-box">
                    <span class="stat-label">Total Seats:</span>
                    <span class="stat-val">{{ designSeats.length }}</span>
                  </div>

                  <p class="guide-text">Click cells to add/remove seats. Icons cycle between seater/sleeper.</p>
                </div>

                <div class="designer-canvas">
                  <div class="deck-toggle" *ngIf="designHasUpperDeck">
                    <mat-button-toggle-group [(ngModel)]="designCurrentDeck">
                      <mat-button-toggle value="lower">Lower</mat-button-toggle>
                      <mat-button-toggle value="upper">Upper</mat-button-toggle>
                    </mat-button-toggle-group>
                  </div>

                  <div class="bus-preview-box">
                    <div class="bus-grid" [style.grid-template-columns]="'repeat(' + designCols + ', 50px)'">
                      @for (r of [].constructor(designRows); track ri; let ri = $index) {
                        @for (c of [].constructor(designCols); track ci; let ci = $index) {
                          <div class="grid-cell" 
                               [class.has-seat]="hasSeat(ri, ci, designCurrentDeck)"
                               [class.is-sleeper]="getSeat(ri, ci, designCurrentDeck)?.seatType === 'sleeper'"
                               (click)="toggleSeat(ri, ci, designCurrentDeck)">
                            @if (hasSeat(ri, ci, designCurrentDeck)) {
                              <span class="s-label">{{ getSeat(ri, ci, designCurrentDeck)?.seatNumber }}</span>
                              <mat-icon class="s-icon" (click)="cycleType(ri, ci, designCurrentDeck, $event)">
                                {{ getSeat(ri, ci, designCurrentDeck)?.seatType === 'sleeper' ? 'king_bed' : 'chair' }}
                              </mat-icon>
                            }
                          </div>
                        }
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div class="stepper-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button class="submit-btn" (click)="addBusWithLayout(stepper)" [disabled]="isSaving || designSeats.length === 0">
                  @if (isSaving) {
                    <span class="btn-loader"></span>
                    Registering...
                  } @else {
                    <mat-icon>check_circle</mat-icon>
                    Finish Registration
                  }
                </button>
              </div>
            </div>
          </mat-step>
        </mat-horizontal-stepper>
      </mat-card>

      @if (isLoading) {
        <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
      } @else {
        <div class="table-card">
          <div class="table-header">
            <h3>Fleet Overview</h3>
            <span class="bus-count">{{ buses.length }} buses</span>
          </div>
          <div class="table-scroll">
            <table mat-table [dataSource]="buses" class="full-width">
              <ng-container matColumnDef="busNumber">
                <th mat-header-cell *matHeaderCellDef>Reg. Number</th>
                <td mat-cell *matCellDef="let bus">
                  <span class="mono-text">{{ bus.busNumber }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="busName">
                <th mat-header-cell *matHeaderCellDef>Bus Name</th>
                <td mat-cell *matCellDef="let bus">
                  <span class="bus-name-cell">{{ bus.busName }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="busType">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let bus">
                  <span class="type-chip">{{ bus.busType }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="capacity">
                <th mat-header-cell *matHeaderCellDef>Seats</th>
                <td mat-cell *matCellDef="let bus">{{ bus.capacity }}</td>
              </ng-container>

              <ng-container matColumnDef="seatLayout">
                <th mat-header-cell *matHeaderCellDef>Layout</th>
                <td mat-cell *matCellDef="let bus">
                  <span class="layout-chip">{{ bus.seatLayout }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let bus">
                  <span [class]="bus.isActive ? 'badge active' : 'badge inactive'">
                    <span class="badge-dot"></span>
                    {{ bus.isActive ? 'Active' : 'Blocked' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let bus">
                  <div class="action-btns">
                    <button class="icon-action design" (click)="designLayout(bus.id)" title="Design Seat Layout">
                      <mat-icon>grid_view</mat-icon>
                    </button>
                    @if (bus.isActive) {
                      <button class="icon-action warn" (click)="toggleBusStatus(bus.id)" title="Block Bus">
                        <mat-icon>block</mat-icon>
                      </button>
                    } @else {
                      <button class="icon-action success" (click)="toggleBusStatus(bus.id)" title="Unblock Bus">
                        <mat-icon>check_circle</mat-icon>
                      </button>
                    }
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          @if (buses.length === 0) {
            <div class="empty-state">
              <mat-icon>directions_bus</mat-icon>
              <p>No buses registered yet. Add your first bus above!</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .manage-buses { max-width: 1200px; }

    .page-title {
      margin-bottom: 28px;
      h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 4px 0; }
      p { color: var(--text-muted); font-size: 0.92rem; margin: 0; }
    }

    .loading { display: flex; justify-content: center; padding: 60px 0; }

    /* Form Card */
    /* Stepper Refinement */
    .registration-stepper-card {
      margin-bottom: 24px;
      padding: 0;
      border-radius: 16px;
      overflow: hidden;
    }
    .step-content {
      padding: 24px;
      min-height: 400px;
    }
    .stepper-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }

    /* Designer Section */
    .designer-section {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 32px;
      align-items: start;
    }
    .designer-sidebar {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }
    .config-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .mini-field { font-size: 12px; }
    .stats-box {
      margin-top: 12px;
      padding: 12px;
      background: var(--primary-red-dim);
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .stat-label { font-weight: 600; font-size: 13px; }
      .stat-val { font-weight: 800; color: var(--primary-red); }
    }
    .guide-text { font-size: 11px; color: var(--text-muted); line-height: 1.4; }

    .designer-canvas {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .bus-preview-box {
      padding: 30px;
      background: white;
      border: 4px solid #334155;
      border-radius: 40px 15px 15px 40px;
      box-shadow: var(--shadow-md);
      width: fit-content;
      min-width: 320px;
      max-width: 600px;
      max-height: 600px;
      overflow-y: auto;
      display: flex;
      justify-content: center;
    }
    .bus-grid {
      display: grid;
      gap: 12px;
      padding: 10px;
      background: #fdfdfd;
      border-radius: 8px;
    }
    .grid-cell {
      width: 50px;
      height: 50px;
      background: #f1f5f9;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover { background: #e2e8f0; transform: scale(1.05); }
      
      &.has-seat {
        background: var(--primary-red);
        color: white;
        border-color: var(--primary-red);
        box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);
        .s-label { opacity: 1; }
      }
      
      &.is-sleeper {
        height: 112px; /* 2 cells + 1 gap */
        grid-row: span 2;
        /* Reverting to vertical sleeper if it looks better, but span 2 col is also common */
      }
      
      .s-label {
        position: absolute;
        top: 4px; left: 6px;
        font-size: 9px; font-weight: 800;
        opacity: 0;
      }
      .s-icon { font-size: 22px; width: 22px; height: 22px; }
    }
    .mt-2 { margin-top: 8px; }
    .full-width { width: 100%; }

    .submit-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 56px;
      padding: 0 24px;
      margin-top: 8px;
      background: var(--primary-red);
      color: white;
      border: none;
      border-radius: 10px;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 10px rgba(225,29,72,0.2);

      &:hover:not(:disabled) {
        background: var(--primary-red-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(225,29,72,0.3);
      }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .btn-loader {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Table Card */
    .table-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);

      h3 {
        font-family: var(--font-display);
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
      }

      .bus-count {
        font-size: 0.82rem;
        color: var(--text-muted);
        background: #f1f5f9;
        padding: 4px 12px;
        border-radius: 100px;
        font-weight: 600;
      }
    }

    .table-scroll { overflow-x: auto; }
    .full-width { width: 100%; }

    .mono-text {
      font-family: 'SF Mono', 'Menlo', monospace;
      font-size: 0.82rem;
      color: var(--text-secondary);
      background: #f8fafc;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .bus-name-cell {
      font-weight: 600;
      color: var(--text-main);
    }

    .type-chip {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--accent-cyan);
      background: rgba(8,145,178,0.08);
      padding: 3px 10px;
      border-radius: 100px;
    }

    .layout-chip {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: #f1f5f9;
      padding: 3px 10px;
      border-radius: 100px;
      font-family: var(--font-display);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
    }
    .badge.active {
      background: rgba(5,150,105,0.08);
      color: #059669;
      .badge-dot { background: #059669; }
    }
    .badge.inactive {
      background: rgba(225,29,72,0.08);
      color: #e11d48;
      .badge-dot { background: #e11d48; }
    }

    .action-btns {
      display: flex;
      gap: 4px;
    }

    .icon-action {
      width: 34px; height: 34px;
      border: none;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: transparent;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }

      &.design {
        color: var(--accent-cyan);
        &:hover { background: rgba(8,145,178,0.1); }
      }
      &.warn {
        color: #e11d48;
        &:hover { background: rgba(225,29,72,0.08); }
      }
      &.success {
        color: #059669;
        &:hover { background: rgba(5,150,105,0.08); }
      }
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-muted);
      mat-icon { font-size: 40px; width: 40px; height: 40px; margin-bottom: 12px; }
      p { margin: 0; font-size: 0.92rem; }
    }
  `]
})
export class ManageBusesComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  buses: BusData[] = [];
  isLoading = true;
  isSaving = false;
  displayedColumns = ['busNumber', 'busName', 'busType', 'capacity', 'seatLayout', 'status', 'actions'];

  // Registration Form
  busForm = this.fb.group({
    busNumber: ['', Validators.required],
    busName: ['', Validators.required],
    capacity: [20, [Validators.required, Validators.min(1), Validators.max(50)]],
    busType: ['AC Sleeper', Validators.required],
    seatLayout: ['2x2', Validators.required]
  });

  // Designer State
  designRows = 5;
  designCols = 4;
  designHasUpperDeck = false;
  designCurrentDeck = 'lower';
  designSeats: SeatLayoutDto[] = [];

  ngOnInit() { this.loadBuses(); }

  loadBuses() {
    this.operatorService.getMyBuses().subscribe({
      next: (data) => { this.buses = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  prepareLayout() {
    if (this.busForm.invalid) {
      this.busForm.markAllAsTouched();
      this.toastr.warning('Please fill all required bus details correctly.');
      return;
    }
    const layout = this.busForm.value.seatLayout;
    if (layout === '2x2') {
      this.designCols = 4;
      this.designRows = Math.ceil((this.busForm.value.capacity || 20) / 4) + 1;
    } else if (layout === '2x1') {
      this.designCols = 3;
      this.designRows = Math.ceil((this.busForm.value.capacity || 20) / 3) + 1;
    } else {
      this.designCols = 2;
      this.designRows = Math.ceil((this.busForm.value.capacity || 20) / 2) + 1;
    }
    this.autoGenerateLayout();
  }

  onDesignGridChange() {
    if (this.designRows < 1) this.designRows = 1;
    if (this.designRows > 15) this.designRows = 15;
    if (this.designCols < 1) this.designCols = 1;
    if (this.designCols > 10) this.designCols = 10;
  }

  autoGenerateLayout() {
    const otherDeckSeats = this.designSeats.filter(s => s.deck !== this.designCurrentDeck);
    const newSeats: SeatLayoutDto[] = [];
    const aisleCol = this.designCols === 4 ? 2 : (this.designCols === 3 ? 2 : -1);

    for (let r = 0; r < this.designRows; r++) {
      for (let c = 0; c < this.designCols; c++) {
        if (c === aisleCol && r < this.designRows - 1) continue; 
        newSeats.push({
          seatNumber: this.generateSeatLabel(r, c, this.designCurrentDeck),
          seatType: this.busForm.value.busType?.includes('Sleeper') ? 'sleeper' : 'seater',
          row: r,
          column: c,
          deck: this.designCurrentDeck
        });
      }
    }
    this.designSeats = [...otherDeckSeats, ...newSeats];
  }

  hasSeat(row: number, col: number, deck: string): boolean {
    return this.designSeats.some(s => s.row === row && s.column === col && s.deck === deck);
  }

  getSeat(row: number, col: number, deck: string) {
    return this.designSeats.find(s => s.row === row && s.column === col && s.deck === deck);
  }

  toggleSeat(row: number, col: number, deck: string) {
    const index = this.designSeats.findIndex(s => s.row === row && s.column === col && s.deck === deck);
    if (index > -1) {
      this.designSeats.splice(index, 1);
    } else {
      this.designSeats.push({
        seatNumber: this.generateSeatLabel(row, col, deck),
        seatType: 'seater',
        row: row,
        column: col,
        deck: deck
      });
    }
  }

  cycleType(row: number, col: number, deck: string, event: Event) {
    event.stopPropagation();
    const seat = this.getSeat(row, col, deck);
    if (seat) {
      seat.seatType = seat.seatType === 'seater' ? 'sleeper' : 'seater';
      if (seat.seatType === 'sleeper') {
         this.designSeats = this.designSeats.filter(s => !(s.row === row && s.column === col + 1 && s.deck === deck));
      }
    }
  }

  generateSeatLabel(row: number, col: number, deck: string): string {
    const prefix = deck === 'upper' ? 'U' : '';
    const rowChar = String.fromCharCode(65 + row);
    return `${prefix}${rowChar}${col + 1}`;
  }

  addBusWithLayout(stepper: any) {
    if (this.busForm.invalid || this.designSeats.length === 0) return;
    this.isSaving = true;
    
    const busData: any = {
      ...this.busForm.value,
      capacity: this.designSeats.length,
      rows: this.designRows,
      columns: this.designCols,
      hasUpperDeck: this.designHasUpperDeck,
      seats: this.designSeats
    };

    // Call Add Bus (backend now handles layout atomically)
    this.operatorService.addBus(busData).subscribe({
      next: () => {
        this.toastr.success('Bus registered with custom layout!');
        this.isSaving = false;
        this.resetForm(stepper);
        this.loadBuses();
      },
      error: () => { this.isSaving = false; }
    });
  }

  resetForm(stepper: any) {
    this.busForm.reset({ capacity: 20, busType: 'AC Sleeper', seatLayout: '2x2' });
    this.designSeats = [];
    stepper.reset();
  }

  toggleBusStatus(id: number) {
    this.operatorService.blockBus(id).subscribe({
      next: (res) => { 
        this.toastr.success(res.message); 
        this.loadBuses(); 
      }
    });
  }

  designLayout(id: number) {
    this.router.navigate(['/operator/buses', id, 'layout']);
  }
}
