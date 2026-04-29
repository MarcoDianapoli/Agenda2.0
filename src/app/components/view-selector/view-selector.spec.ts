import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelector } from './view-selector';

describe('ViewSelector', () => {
  let component: ViewSelector;
  let fixture: ComponentFixture<ViewSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
