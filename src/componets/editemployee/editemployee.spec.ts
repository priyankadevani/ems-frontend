import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editemployee } from './editemployee';

describe('Editemployee', () => {
  let component: Editemployee;
  let fixture: ComponentFixture<Editemployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editemployee],
    }).compileComponents();

    fixture = TestBed.createComponent(Editemployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
