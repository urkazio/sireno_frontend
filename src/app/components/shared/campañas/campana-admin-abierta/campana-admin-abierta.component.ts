import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService } from '../../../../services/languaje.service';
import { AuthService } from 'src/app/services/auth.service';
import { PopupfactoryService } from 'src/app/services/popupfactory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campana-admin-abierta',
  templateUrl: './campana-admin-abierta.component.html',
  styleUrls: ['./campana-admin-abierta.component.css']
})
export class CampanaAdminAbiertaComponent implements OnInit {

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
  parpadeo = false;

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private languageService: LanguageService, // Servicio de idioma
    private router: Router,
    private popupfactoryService: PopupfactoryService
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

    // Obtener el estado de activación cada segundo
    this.getNumRespuestas();
  }

  
  getTiempoCierre() {
    const fechaActual = new Date();
    const fechaFinActivacion = this.fecha_hora_cierre;
  
    if (fechaFinActivacion) {
      // Calcula la diferencia en milisegundos
      const diferenciaMs = fechaFinActivacion.getTime() - fechaActual.getTime();

      // Verifica si el tiempo restante es menor o igual a cero
      if (diferenciaMs <= 0) {
        
        window.location.reload(); // Recarga la página
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
    

  async cerrar() {
    const cerrar = await this.popupfactoryService.openOkPoup(this.strings["popup.cerrar.head"], this.strings["popup.cerrar.body"]);

    if (cerrar) {

      //agrupar el conjunto de situaciones de la campaña en un array:
      const situaciones = [this.cod_situacion_docente];
      if (this.agrupado_con !== null) {
        this.agrupado_con.forEach((agrupado:any) => {
          situaciones.push(agrupado.cod_situacion_docente);
        });
      }

      this.authService.desactivarCampana(situaciones).subscribe((res: any) => {

         // Comprobar si todas las respuestas son true
         if (Array.isArray(res) && res.every((respuesta) => respuesta === true)) {
          // Almacena un indicador en el almacenamiento local del navegador
          localStorage.setItem('encuestaCerradaOK', 'true');
          setTimeout(() => {
            window.location.reload();
          }, 1000); 
        
        } else {
          this.popupfactoryService.openOkPoup(this.strings["popup.activacionERR3.head"], this.strings["popup.activacionERR3.body"])
        }
      });
    }
  }

  getNumRespuestas() {
    //agrupar el conjunto de situaciones de la campaña en un array:
    const situaciones = [this.cod_situacion_docente];
    if (this.agrupado_con !== null) {
      this.agrupado_con.forEach((agrupado:any) => {
        situaciones.push(agrupado.cod_situacion_docente);
      });
    }

    // comprobar cada segundo si ha habido respuestas nuevas
    interval(1000).subscribe(() => {
      if (situaciones) {
        this.authService.getRespondidos(situaciones).subscribe((total_respondidos: any) => {
          if(this.n_alum_respondido){
            if (total_respondidos['suma'] > this.n_alum_respondido){

              //actualizar el numero de respondidos y añadir efecto de parpadeo
              this.n_alum_respondido = total_respondidos['suma'];
              this.parpadeo = true;
              setTimeout(() => {
                this.parpadeo = false;
              }, 1000);
            }
          }
        });
      }
    });
  }


}
