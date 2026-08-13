import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attendancelist } from './attendancelist';

describe('Attendancelist', () => {
  let component: Attendancelist;
  let fixture: ComponentFixture<Attendancelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attendancelist],
    }).compileComponents();

    fixture = TestBed.createComponent(Attendancelist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
