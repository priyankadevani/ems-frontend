import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attendanceteam } from './attendanceteam';

describe('Attendanceteam', () => {
  let component: Attendanceteam;
  let fixture: ComponentFixture<Attendanceteam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attendanceteam],
    }).compileComponents();

    fixture = TestBed.createComponent(Attendanceteam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
