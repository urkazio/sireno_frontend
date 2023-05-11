import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdminsComponent } from './navbar-admins.component';

describe('NavbarAdminsComponent', () => {
  let component: NavbarAdminsComponent;
  let fixture: ComponentFixture<NavbarAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarAdminsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
