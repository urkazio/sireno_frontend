import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedEncuestasService {
  selectedEncuestas: any[] = [];

  constructor() {}

  agregarEncuesta(encuesta: any) {
    if (!this.selectedEncuestas.includes(encuesta)) {
      this.selectedEncuestas.push(encuesta);
    }
  }

  eliminarEncuesta(encuesta: any) {
    const index = this.selectedEncuestas.indexOf(encuesta);
    if (index > -1) {
      this.selectedEncuestas.splice(index, 1);
    }
  }

  obtenerEncuestas() {
    return this.selectedEncuestas;
  }

  vaciarEncuestas() {
    this.selectedEncuestas = [];
  }
}
