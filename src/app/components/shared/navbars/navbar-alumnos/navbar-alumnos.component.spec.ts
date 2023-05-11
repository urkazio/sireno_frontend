import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAlumnosComponent } from './navbar-alumnos.component';

describe('NavbarAlumnosComponent', () => {
  let component: NavbarAlumnosComponent;
  let fixture: ComponentFixture<NavbarAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarAlumnosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
