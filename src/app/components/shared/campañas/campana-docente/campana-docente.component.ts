import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService } from '../../../../services/languaje.service';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../services/data.service';
import { PopupfactoryService } from '../../../../services/popupfactory.service'
import { AuthService } from '../../../../services/auth.service'

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
  agrupado_con: any;
  strings: any; // Variable para almacenar los textos
  tiempoRestante: Observable<string> = new Observable<string>();
  

  constructor(
    private languageService: LanguageService, // Servicio de idioma
    private router: Router, // Router para redirigir al usuario
    private dataSharingService: DataSharingService, // servicio de datos para pasar al componente 2
    private popupfactoryService: PopupfactoryService,
    private authService : AuthService
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
  
    this.popupfactoryService.openFechaHoraPopup(this.strings["popup.activacion.head"], this.strings["popup.activacion.body"])
      .then((selectedDateTime: string) => {

        // Comparar la fecha y hora seleccionadas con fecha_fin
        const fechaHoraFinActivacion = new Date(selectedDateTime);
        if (this.fecha_fin){
          const fechaActual = new Date();

          // La fecha y hora seleccionadas son posteriores a fecha_fin --> abrir campaña
          if (fechaHoraFinActivacion < this.fecha_fin && fechaHoraFinActivacion >= fechaActual ) {

            //agrupar el conjunto de situaciones de la campaña en un array:
            const situaciones = [this.cod_situacion_docente];
            if (this.agrupado_con !== null) {
              this.agrupado_con.forEach((agrupado:any) => {
                situaciones.push(agrupado.cod_situacion_docente);
              });
            }

            this.authService.abrirCampanna(situaciones, selectedDateTime).subscribe((res: any) => {

              // Comprobar si todas las respuestas son true
              if (Array.isArray(res) && res.every((respuesta) => respuesta === true)) {
                // Almacena un indicador en el almacenamiento local del navegador
                localStorage.setItem('encuestaAbiertaOK', 'true');
                window.location.reload();
              } else {
                this.popupfactoryService.openOkPoup(this.strings["popup.activacionERR2.head"], this.strings["popup.activacionERR2.body"])
              }
            });


          } else {
            // La fecha y hora seleccionadas son anteriores a fecha_fin --> NO abrir campaña
            this.popupfactoryService.openOkPoup(this.strings["popup.activacionERR.head"], this.strings["popup.activacionERR.body"])
          }
        }

      });
  }
  
}
