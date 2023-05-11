import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDocentesComponent } from './index-docentes.component';

describe('IndexDocentesComponent', () => {
  let component: IndexDocentesComponent;
  let fixture: ComponentFixture<IndexDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexDocentesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
