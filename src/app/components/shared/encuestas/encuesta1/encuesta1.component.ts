import { Component, HostListener, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/languaje.service';
import { AuthService } from '../../../../services/auth.service';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../services/data.service';
import { PopupfactoryService } from '../../../../services/popupfactory.service';

@Component({
  selector: 'app-encuesta1',
  templateUrl: './encuesta1.component.html',
  styleUrls: ['./encuesta1.component.css']
})
export class Encuesta1Component implements OnInit {

  cod_encuesta: string = '';
  encuesta: any[] = [];
  nombre_encuesta : string = '';
  cod_situacion_docente : string = '';
  nombreAsignatura : string = '';
  nombre_docente : string = '';
  fecha_fin_activacion: Date | null = null;
  numerica : number | null = null;
  strings: any; // Variable para almacenar los textos
  tiempoRestante: Observable<string> = new Observable<string>();
  isActiva: boolean = false; // Variable para almacenar el estado de la activación

  constructor(
    private authService: AuthService, 
    private languageService: LanguageService,
    private router: Router, // Router para redirigir al usuario
    private dataSharingService: DataSharingService,
    private popupfactoryService: PopupfactoryService,
    ) {}


    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: Event) {
      event.preventDefault();
      event.returnValue = false;
    }
    

  ngOnInit() {

    //recuperar los parametros pasados por la vista llamadora
    const parametros = this.dataSharingService.getData('parametrosEncuesta');

    if (parametros) {
      this.cod_encuesta = parametros.cod_encuesta;
      this.fecha_fin_activacion = parametros.fecha_fin_activacion;
      this.cod_situacion_docente = parametros.cod_situacion_docente;
      this.nombreAsignatura = parametros.nombreAsignatura;
      this.nombre_docente = parametros.nombre_docente;
    }

    //actualizar el tiempo restante de las campañas con un observable
    this.tiempoRestante = interval(1000).pipe(
      map(() => this.getTiempoCierre())
    );

    // Obtener el estado de activación cada segundo
    this.isActivaLoop();

    //gestion de idiomas
    const lang = 'es'; // Idioma predeterminado
    this.languageService.currentLanguage$.subscribe(lang => { // Suscripción a cambios en el idioma actual
      this.languageService.loadStrings(lang).subscribe( // Carga los strings correspondientes al idioma actual
        data => {
          this.cargarEncuesta();
          this.strings = data; // Almacena los textos cargados en la variable 'strings'
        },
        error => {
          console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
        }
      );
    });
 

  }

  cargarEncuesta(){
    this.authService.getEncuesta(this.cod_encuesta, this.languageService.getCurrentLanguageValue()).subscribe(
      (encuesta: any) => {
        this.encuesta = encuesta;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async verificarRespuestas() {
    const preguntasSinRespuesta = this.encuesta.filter(pregunta => {
      return !pregunta.respuestas.some((respuesta: { cod_respuesta: string, texto: string, selected: boolean }) => respuesta.selected);
    });
  
    if (preguntasSinRespuesta.length > 0) {
      const result = await this.popupfactoryService.openOkPoup(this.strings["popup.encuesta.head"], this.strings["popup.encuesta.body"]);
      return result;
    }
    return true;
  }

  getTiempoCierre() {
    const fechaActual = new Date();
    const fechaFinActivacion = this.fecha_fin_activacion;

    if (fechaFinActivacion) {

      // Calcula la diferencia en milisegundos
      const diferenciaMs = fechaFinActivacion.getTime() - fechaActual.getTime();

      
      // Verifica si el tiempo restante es menor o igual a cero
      if (diferenciaMs <= 0) {
        this.router.navigate(['indexAlumnos']);
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
  
  async cancelar() {
    const result = await this.popupfactoryService.openOkPoup(this.strings["popup.canclear.head"], this.strings["popup.canclear.body"]);
    console.log(result);
    if (result) {
      this.router.navigate(['indexAlumnos']);
    }
  }
  

  async enviar() {

    //invocar al popup
    const enviar = await this.verificarRespuestas();

    if (enviar) {
      let respuestasJSON = [];

      //iterar la encuesta para agrupar cada pregunta con su respuesta en un JSON
      for (let i = 0; i < this.encuesta.length; i++) {
        const pregunta = this.encuesta[i];

        if (pregunta.respuestas.some((respuesta: any) => respuesta.selected)) {
          const respuestaSeleccionada = pregunta.respuestas.find((respuesta: any) => respuesta.selected);
          const respuestaJSON = {
            numerica : pregunta.numerica,
            cod_pregunta: pregunta.cod_pregunta,
            cod_respuesta: respuestaSeleccionada.cod_respuesta
          };
          respuestasJSON.push(respuestaJSON);
        }

      }

      //enviar el JSON de respuestas al back-end
      const exitoso = this.authService.enviarRespuestasAlumno(respuestasJSON, this.cod_situacion_docente);
      exitoso.subscribe(() => {
          // si el envio de respuestas ha sido exitoso --> redirigir y notificar
          this.router.navigate(['indexAlumnos']);
          this.popupfactoryService.openOkPoup(this.strings["popup.enviada.head"], this.strings["popup.enviada.body"]);
        },
        error => {
          console.log('Error:', error);
          this.popupfactoryService.openOkPoup(this.strings["popup.errorEnvio.head"], this.strings["popup.errorEnvio.body"]);
        }
      );
    }
  }
  

  isActivaLoop() {
    interval(1000).subscribe(() => {
      if (this.cod_situacion_docente) {
        this.authService.isActiva(this.cod_situacion_docente).subscribe((res: any) => {
          // Comprobar si todas las respuestas son true
          if (res === false) {
            localStorage.setItem('encuestaInactiva', 'true');
            setTimeout(() => {
              window.location.reload();
            }, 1200); 
            this.router.navigate(['indexAlumnos']);    
          }
        });
      }
    });
  }
  


}

