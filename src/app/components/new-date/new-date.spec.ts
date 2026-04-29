import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDate } from './new-date';

describe('NewDate', () => {
  let component: NewDate;
  let fixture: ComponentFixture<NewDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDate],
    }).compileComponents();

    fixture = TestBed.createComponent(NewDate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
