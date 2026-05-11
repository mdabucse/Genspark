import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../testing/test-providers';

import { AdminDashboardComponent } from './admin-dashboard.component';

describe('AdminDashboard', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: commonTestingProviders
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
