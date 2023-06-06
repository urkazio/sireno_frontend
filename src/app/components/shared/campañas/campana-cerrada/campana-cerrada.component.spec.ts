import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanaCerradaComponent } from './campana-cerrada.component';

describe('CampanaCerradaComponent', () => {
  let component: CampanaCerradaComponent;
  let fixture: ComponentFixture<CampanaCerradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampanaCerradaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampanaCerradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
