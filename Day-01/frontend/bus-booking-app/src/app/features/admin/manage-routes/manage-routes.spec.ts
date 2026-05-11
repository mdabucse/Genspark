import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../testing/test-providers';

import { ManageRoutesComponent } from './manage-routes.component';

describe('ManageRoutes', () => {
  let component: ManageRoutesComponent;
  let fixture: ComponentFixture<ManageRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoutesComponent],
      providers: commonTestingProviders
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
