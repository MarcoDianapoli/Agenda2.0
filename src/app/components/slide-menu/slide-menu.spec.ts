import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideMenu } from './slide-menu';

describe('SlideMenu', () => {
  let component: SlideMenu;
  let fixture: ComponentFixture<SlideMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
