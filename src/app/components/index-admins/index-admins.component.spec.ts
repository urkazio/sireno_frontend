import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAdminsComponent } from './index-admins.component';

describe('IndexAdminsComponent', () => {
  let component: IndexAdminsComponent;
  let fixture: ComponentFixture<IndexAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexAdminsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
