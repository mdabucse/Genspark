import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { OperatorService, BusData, SeatLayoutDto } from '../../../core/services/operator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bus-layout-designer',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCheckboxModule,
    MatButtonToggleModule
  ],
  template: `
    <div class="designer-container animate-fade-in-up">
      <header class="designer-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1>Design Layout: <span class="bus-name">{{ bus?.busName }}</span></h1>
          <p class="subtitle">{{ bus?.busNumber }} — Configure your seat arrangement</p>
        </div>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" (click)="saveLayout()" [disabled]="isSaving">
          <mat-icon>save</mat-icon>
          {{ isSaving ? 'Saving...' : 'Save Layout' }}
        </button>
      </header>

      <div class="designer-layout">
        <!-- Configuration Sidebar -->
        <aside class="sidebar">
          <mat-card class="config-card">
            <mat-card-header>
              <mat-card-title>Grid Settings</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="grid-inputs">
                <mat-form-field appearance="outline">
                  <mat-label>Rows</mat-label>
                  <input matInput type="number" [(ngModel)]="rows">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Columns</mat-label>
                  <input matInput type="number" [(ngModel)]="cols">
                </mat-form-field>
              </div>
              <button mat-stroked-button color="accent" class="full-width" (click)="autoGenerateLayout()">
                <mat-icon>auto_awesome</mat-icon>
                Auto-Generate Seats
              </button>
              <mat-checkbox [(ngModel)]="hasUpperDeck" class="mt-2">
                Has Upper Deck
              </mat-checkbox>
            </mat-card-content>
          </mat-card>

          <mat-card class="legend-card">
            <mat-card-header>
              <mat-card-title>Quick Tips</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ul>
                <li>Enter Rows/Cols and click <b>Auto-Generate</b> to fill the bus instantly.</li>
                <li>The system adds an aisle automatically for 3 or 4 column buses.</li>
                <li>You can still click individual cells to fine-tune the layout.</li>
              </ul>
            </mat-card-content>
          </mat-card>

          <mat-card class="stats-card">
            <mat-card-content>
              <div class="stat-item">
                <span class="label">Total Capacity:</span>
                <span class="value">{{ getTotalSeats() }} Seats</span>
              </div>
            </mat-card-content>
          </mat-card>
        </aside>

        <!-- Main Designer Area -->
        <main class="canvas">
          <div class="deck-selector" *ngIf="hasUpperDeck">
            <mat-button-toggle-group [(ngModel)]="currentDeck">
              <mat-button-toggle value="lower">Lower Deck</mat-button-toggle>
              <mat-button-toggle value="upper">Upper Deck</mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <div class="bus-container">
            <div class="bus-front">
              <div class="steering">
                <mat-icon>steering</mat-icon>
              </div>
            </div>
            
            <div class="grid-wrapper">
              <div class="grid" [style.grid-template-columns]="'repeat(' + cols + ', 1fr)'">
                @for (r of [].constructor(rows); track ri; let ri = $index) {
                  @for (c of [].constructor(cols); track ci; let ci = $index) {
                    <div 
                      class="grid-cell" 
                      [class.has-seat]="hasSeat(ri, ci, currentDeck)"
                      [class.is-sleeper]="getSeat(ri, ci, currentDeck)?.seatType === 'sleeper'"
                      (click)="toggleSeat(ri, ci, currentDeck)">
                      
                      @if (hasSeat(ri, ci, currentDeck)) {
                        <div class="seat-content">
                          <span class="seat-label">{{ getSeat(ri, ci, currentDeck)?.seatNumber }}</span>
                          <mat-icon *ngIf="getSeat(ri, ci, currentDeck)?.seatType === 'sleeper'">king_bed</mat-icon>
                          <mat-icon *ngIf="getSeat(ri, ci, currentDeck)?.seatType === 'seater'">chair</mat-icon>
                          
                          <div class="seat-settings" (click)="$event.stopPropagation()">
                            <button mat-icon-button class="mini-btn" (click)="cycleType(ri, ci, currentDeck)">
                              <mat-icon>sync</mat-icon>
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .designer-container {
      padding: var(--space-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    .designer-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
      
      h1 { margin: 0; font-size: 1.8rem; }
      .bus-name { color: var(--primary-red); }
      .subtitle { margin: 0; color: var(--text-muted); }
      .spacer { flex: 1; }
    }

    .designer-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: var(--space-xl);
      align-items: start;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .grid-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .legend-card ul {
      padding-left: 20px;
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
      li { margin-bottom: 8px; }
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      font-size: 1.1rem;
      .label { color: var(--text-secondary); }
      .value { color: var(--primary-red); }
    }

    .canvas {
      background: white;
      border-radius: 24px;
      padding: 40px;
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 600px;
      box-shadow: var(--shadow-sm);
    }

    .deck-selector {
      margin-bottom: var(--space-xl);
    }

    .bus-container {
      display: flex;
      background: #ffffff;
      border: 4px solid #333;
      border-radius: 40px 15px 15px 40px;
      padding: 30px;
      position: relative;
      box-shadow: var(--shadow-md);
      min-width: 600px;
    }

    .bus-front {
      width: 80px;
      border-right: 2px solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 30px;

      .steering {
        width: 40px;
        height: 40px;
        border: 2px solid #999;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
      }
    }

    .grid-wrapper {
      flex: 1;
      overflow-x: auto;
    }

    .grid {
      display: grid;
      gap: 15px;
      background: #fdfdfd;
      padding: 10px;
    }

    .grid-cell {
      aspect-ratio: 1;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #e2e8f0;
        transform: scale(1.05);
      }

      &.has-seat {
        background: var(--primary-red);
        border-color: var(--primary-red);
        color: white;
        box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);

        &:hover {
          background: var(--primary-red-hover);
        }
      }

      &.is-sleeper {
        aspect-ratio: 2/1;
        grid-column: span 2;
      }
    }

    .seat-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      width: 100%;
      height: 100%;
      justify-content: center;

      .seat-label {
        font-size: 0.7rem;
        font-weight: 800;
        position: absolute;
        top: 4px;
        left: 6px;
      }

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .seat-settings {
      position: absolute;
      bottom: 2px;
      right: 2px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .grid-cell:hover .seat-settings { opacity: 1; }

    .mini-btn {
      width: 24px;
      height: 24px;
      line-height: 24px;
      background: rgba(0,0,0,0.2);
      color: white;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }
    .mt-2 { margin-top: 8px; }
    .full-width { width: 100%; }
  `]
})
export class BusLayoutDesignerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private operatorService = inject(OperatorService);
  private toastr = inject(ToastrService);

  busId!: number;
  bus: BusData | null = null;
  isSaving = false;

  // Grid config
  rows = 5;
  cols = 4;
  hasUpperDeck = false;
  currentDeck = 'lower';
  
  seats: SeatLayoutDto[] = [];

  ngOnInit() {
    this.busId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBus();
  }

  loadBus() {
    this.operatorService.getMyBuses().subscribe(buses => {
      this.bus = buses.find(b => b.id === this.busId) || null;
      if (this.bus) {
        // Handle both camelCase and PascalCase from backend
        this.rows = (this.bus as any).rows || (this.bus as any).Rows || 5;
        this.cols = (this.bus as any).columns || (this.bus as any).Columns || 4;
        this.hasUpperDeck = (this.bus as any).hasUpperDeck || (this.bus as any).HasUpperDeck || false;
        
        // Deep copy seats to avoid reference issues
        this.seats = this.bus.seats ? [...this.bus.seats] : [];
        console.log('Loaded seats:', this.seats.length);
      }
    });
  }

  autoGenerateLayout() {
    // Validate inputs
    if (this.rows < 1) this.rows = 1;
    if (this.cols < 1) this.cols = 1;

    // Filter out seats only for the current deck to preserve other deck
    const otherDeckSeats = this.seats.filter(s => s.deck !== this.currentDeck);
    
    const newSeats: SeatLayoutDto[] = [];
    const aisleCol = this.cols === 4 ? 2 : -1; // Only auto-skip aisle for 4-column (2+2) layouts

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // Skip aisle
        if (c === aisleCol && r < this.rows - 1) continue; 

        newSeats.push({
          seatNumber: this.generateSeatLabel(r, c, this.currentDeck),
          seatType: 'seater',
          row: r,
          column: c,
          deck: this.currentDeck
        });
      }
    }
    
    this.seats = [...otherDeckSeats, ...newSeats];
    this.toastr.info(`Generated ${newSeats.length} seats for ${this.currentDeck} deck`);
  }

  onGridChange() {
    // Basic validation
    if (this.rows < 1) this.rows = 1;
    if (this.cols < 1) this.cols = 1;
    if (this.rows > 15) this.rows = 15;
    if (this.cols > 10) this.cols = 10;
  }

  hasSeat(row: number, col: number, deck: string): boolean {
    return this.seats.some(s => s.row === row && s.column === col && s.deck === deck);
  }

  getSeat(row: number, col: number, deck: string) {
    return this.seats.find(s => s.row === row && s.column === col && s.deck === deck);
  }

  toggleSeat(row: number, col: number, deck: string) {
    const index = this.seats.findIndex(s => s.row === row && s.column === col && s.deck === deck);
    if (index > -1) {
      this.seats.splice(index, 1);
    } else {
      this.seats.push({
        seatNumber: this.generateSeatLabel(row, col, deck),
        seatType: 'seater',
        row: row,
        column: col,
        deck: deck
      });
    }
  }

  cycleType(row: number, col: number, deck: string) {
    const seat = this.getSeat(row, col, deck);
    if (seat) {
      seat.seatType = seat.seatType === 'seater' ? 'sleeper' : 'seater';
      // If changed to sleeper, ensure no seat in next column
      if (seat.seatType === 'sleeper') {
         this.seats = this.seats.filter(s => !(s.row === row && s.column === col + 1 && s.deck === deck));
      }
    }
  }

  generateSeatLabel(row: number, col: number, deck: string): string {
    const prefix = deck === 'upper' ? 'U' : '';
    const rowChar = String.fromCharCode(65 + row);
    return `${prefix}${rowChar}${col + 1}`;
  }

  getTotalSeats(): number {
    return this.seats.length;
  }

  saveLayout() {
    // VALIDATION
    if (this.seats.length === 0) {
      this.toastr.error('Layout must have at least one seat.');
      return;
    }

    // Check for duplicate seat numbers
    const seatNumbers = this.seats.map(s => s.seatNumber);
    if (new Set(seatNumbers).size !== seatNumbers.length) {
      this.toastr.error('Duplicate seat numbers detected. Please rename overlapping seats.');
      return;
    }

    // Check for overlapping sleepers (if a sleeper takes 2 columns, there shouldn't be a seat in the next column)
    for (const seat of this.seats) {
      if (seat.seatType === 'sleeper') {
        const overlap = this.seats.find(s => s.row === seat.row && s.column === seat.column + 1 && s.deck === seat.deck);
        if (overlap) {
          this.toastr.error(`Sleeper seat ${seat.seatNumber} overlaps with seat ${overlap.seatNumber}.`);
          return;
        }
      }
    }

    this.isSaving = true;
    const layout = {
      rows: this.rows,
      columns: this.cols,
      hasUpperDeck: this.hasUpperDeck,
      seats: this.seats
    };

    this.operatorService.saveLayout(this.busId, layout).subscribe({
      next: (res) => {
        this.toastr.success('Layout saved successfully');
        this.isSaving = false;
        this.router.navigate(['/operator/buses']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to save layout');
        this.isSaving = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/operator/buses']);
  }
}
