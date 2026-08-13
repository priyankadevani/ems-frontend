import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDesignation } from './edit-designation';

describe('EditDesignation', () => {
  let component: EditDesignation;
  let fixture: ComponentFixture<EditDesignation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDesignation],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDesignation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
