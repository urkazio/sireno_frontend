import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAlumnosComponent } from './index-alumnos.component';

describe('IndexAlumnosComponent', () => {
  let component: IndexAlumnosComponent;
  let fixture: ComponentFixture<IndexAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexAlumnosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
