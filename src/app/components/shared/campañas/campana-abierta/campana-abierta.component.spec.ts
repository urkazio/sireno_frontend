import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanaAbiertaComponent } from './campana-abierta.component';

describe('CampanaAbiertaComponent', () => {
  let component: CampanaAbiertaComponent;
  let fixture: ComponentFixture<CampanaAbiertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampanaAbiertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampanaAbiertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
