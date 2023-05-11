import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDocentesComponent } from './navbar-docentes.component';

describe('NavbarDocentesComponent', () => {
  let component: NavbarDocentesComponent;
  let fixture: ComponentFixture<NavbarDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarDocentesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
