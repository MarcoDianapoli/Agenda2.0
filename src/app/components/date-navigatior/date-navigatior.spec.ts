import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateNavigatior } from './date-navigatior';

describe('DateNavigatior', () => {
  let component: DateNavigatior;
  let fixture: ComponentFixture<DateNavigatior>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateNavigatior],
    }).compileComponents();

    fixture = TestBed.createComponent(DateNavigatior);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
