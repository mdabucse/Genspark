import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../testing/test-providers';

import { PassengerFormComponent } from './passenger-form.component';

describe('PassengerForm', () => {
  let component: PassengerFormComponent;
  let fixture: ComponentFixture<PassengerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerFormComponent],
      providers: commonTestingProviders
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
