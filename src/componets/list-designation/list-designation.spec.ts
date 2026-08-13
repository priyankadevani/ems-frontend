import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesignation } from './list-designation';

describe('ListDesignation', () => {
  let component: ListDesignation;
  let fixture: ComponentFixture<ListDesignation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDesignation],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDesignation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
