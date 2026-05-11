import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../testing/test-providers';

import { ManageOperatorsComponent } from './manage-operators.component';

describe('ManageOperators', () => {
  let component: ManageOperatorsComponent;
  let fixture: ComponentFixture<ManageOperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageOperatorsComponent],
      providers: commonTestingProviders
    }).compileComponents();

    fixture = TestBed.createComponent(ManageOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
