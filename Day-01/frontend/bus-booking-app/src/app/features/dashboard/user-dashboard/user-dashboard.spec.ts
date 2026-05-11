import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../testing/test-providers';

import { UserDashboardComponent } from './user-dashboard.component';

describe('UserDashboard', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashboardComponent],
      providers: commonTestingProviders
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
