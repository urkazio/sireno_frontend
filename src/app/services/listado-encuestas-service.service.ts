import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListadoEncuestasService {
  private mostrarEncuestasFiltrosSource = new Subject<void>();

  mostrarEncuestasFiltros$ = this.mostrarEncuestasFiltrosSource.asObservable();

  mostrarEncuestasFiltros() {
    this.mostrarEncuestasFiltrosSource.next();
  }
}
