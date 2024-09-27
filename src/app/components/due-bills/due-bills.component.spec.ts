import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueBillsComponent } from './due-bills.component';

describe('DueBillsComponent', () => {
  let component: DueBillsComponent;
  let fixture: ComponentFixture<DueBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
