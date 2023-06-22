import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService } from '../../../../services/languaje.service';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../services/data.service';

@Component({
  selector: 'app-campana-docente',
  templateUrl: './campana-docente.component.html',
  styleUrls: ['./campana-docente.component.css']
})
export class CampanaDocenteComponent implements OnInit {

  mostrarCampana: boolean = true;
  cod_situacion_docente: string = '';
  n_alum_total: number | null = null;
  n_alum_respondido: number | null = null;
  nombre_Asignatura: string = '';
  fecha_fin: Date | null = null;
  fecha_hora_cierre: Date | null = null;
  num_curso: number | null = null;
  anno_curso: string = '';
  veces_abierta: number | null = null;
  strings: any; // Variable para almacenar los textos
  tiempoRestante: Observable<string> = new Observable<string>();
  

  constructor(
    private languageService: LanguageService, // Servicio de idioma
    private router: Router, // Router para redirigir al usuario
    private dataSharingService: DataSharingService // servicio de datos para pasar al componente 2
  ) {}


  ngOnInit() {

    //actualizar el tiempo restante de las campañas con un observable
    this.tiempoRestante = interval(1000).pipe(
      map(() => this.getTiempoCierre())
    );

    //gestion de idiomas
    const lang = 'es'; // Idioma predeterminado
    this.languageService.currentLanguage$.subscribe(lang => { // Suscripción a cambios en el idioma actual
      this.languageService.loadStrings(lang).subscribe( // Carga los strings correspondientes al idioma actual
        data => {
          this.strings = data; // Almacena los textos cargados en la variable 'strings'
        },
        error => {
          console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
        }
      );
    });
  }

  
  getTiempoCierre() {
    const fechaActual = new Date();
    const fechaFinCammpañaValida = this.fecha_fin;
  
    if (fechaFinCammpañaValida) {
      // Calcula la diferencia en milisegundos
      const diferenciaMs = fechaFinCammpañaValida.getTime() - fechaActual.getTime();

      // Verifica si el tiempo restante es menor o igual a cero
      if (diferenciaMs <= 0) {
        this.mostrarCampana = false; // Oculta la campaña
        return ''; // Retorna una cadena vacía para no mostrar el tiempo restante
      }
  
      // Calcula las horas, minutos y segundos
      const segundos = Math.floor(diferenciaMs / 1000);
      const minutos = Math.floor(segundos / 60);
      const horas = Math.floor(minutos / 60);
  
      // Formatea la diferencia en hh:mm:ss
      const horasFormateadas = this.agregarCerosIzquierda(horas);
      const minutosFormateados = this.agregarCerosIzquierda(minutos % 60);
      const segundosFormateados = this.agregarCerosIzquierda(segundos % 60);
  
      return `${horasFormateadas}h: ${minutosFormateados}m: ${segundosFormateados}s`;
    }
  
    return ''; // Retorna un valor por defecto en caso de que fecha_fin_activacion sea null
  }
  
  agregarCerosIzquierda(valor: number) {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }
    
  activar() {

    /*
    // pasar los parametros necesarios a la vista de la encuesta
    const parametros = {
      cod_encuesta: this.cod_encuesta,
      fecha_fin_activacion : this.fecha_fin_activacion,
      cod_situacion_docente : this.cod_situacion_docente,
      nombreAsignatura: this.nombreAsignatura,
      nombre_docente: this.nombre_docente
    };

    this.dataSharingService.setData('parametrosEncuesta', parametros);

    this.router.navigate(['encuesta']);
    */

  }
}
