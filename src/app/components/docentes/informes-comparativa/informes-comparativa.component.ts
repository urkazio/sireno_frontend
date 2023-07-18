import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';



interface Asignatura {
  [key: string]: {
    situaciones_docentes: string[];
  };
}

interface Pregunta {
  cod_pregunta: string;
  media: string;
  numerica: number;
  respuestas: any[];
  texto_pregunta: string;
  cuantos: number[][] // Variable auxiliar para almacenar los valores del array 'cuantos'
}


interface Respuesta {
  cod_situacion_docente: string[];
  año_curso: string;
  cod_pregunta: string;
  texto_pregunta: string;
  numerica: number;
  respuestas: {
    cod_respuesta: string;
    cuantos: number;
  }[];
  media: string;
}


@Component({
  selector: 'app-informes-comparativa',
  templateUrl: './informes-comparativa.component.html',
  styleUrls: ['./informes-comparativa.component.css']
})
export class InformesComparativaComponent implements OnInit{
  encuesta: any[] = [];
  comparativa: any[] = [];
  strings: any; // Variable para almacenar los textos
  asignaturas: any[]  = [];
  comparaciones: string[] = ['asignatura.historico','asignatura', 'grupo', 'departamento', 'curso', 'titulacion', 'centro'];
  selectedAsignatura: Asignatura | null = null;
  selectedYear: any;
  selectedYearDrop: boolean = false;
  selectedComparacion: any;
  selectedComparacionDrop: boolean = false;
  situacion_docente: any;
  datos_informe: boolean = false;
  encuestaCargada: boolean = false;
  historicoPregunta: Respuesta[] = [];
  parametrosGrafica: any;
  rdo_personales: any[] = [];
  rdo_media: any[] = [];


  constructor(
    public languageService: LanguageService, // Servicio de idioma
    private authService: AuthService,
  ) {}

  
  ngOnInit() {
    const lang = 'es'; // Idi oma predeterminado
    this.languageService.currentLanguage$.subscribe(lang => { // Suscripción a cambios en el idioma actual
      this.languageService.loadStrings(lang).subscribe( // Carga los strings correspondientes al idioma actual
        data => {
          this.mostrarInforme()
          this.strings = data; // Almacena los textos cargados en la variable 'strings'
        },
        error => {
          console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
        }
      );
    });

    this.getAsignaturasAñoDocente();
  }

  getAsignaturasAñoDocente(){
    this.authService.getAsignaturasPublicadas().subscribe((res: any) => {
      this.asignaturas = res;
    });
  }

  selectAsignatura(asignatura: any) {
    this.selectedAsignatura = asignatura;
    this.selectedYear = null;  
    this.selectedYearDrop = false;
  }

  getAsignaturaYears(asignatura: any): string[] {
    const years: string[] = [];
  
    for (const key in asignatura) {
      if (key !== 'nombre_asignatura') {
        years.push(key);
      }
    }
    this.selectedYearDrop = true;
    return years;
  }

  selectComparacion(comparacion: any) {
    this.selectedComparacion = comparacion;
    this.selectedComparacionDrop = true;
  } 

  mostrarInforme() {
    if (this.selectedAsignatura && this.selectedYear) {
      const situacionesDocentes = this.selectedAsignatura[this.selectedYear]?.situaciones_docentes;
      
      this.authService.getDatosSD(situacionesDocentes).subscribe((res: any) => {

        if(res!='No se encontraron datos.'){
          this.datos_informe=true;
          this.situacion_docente=res;
          this.cargarInforme();
        }
      });
    }
  }

  cargarInforme() {

    this.authService.getResultadosInformePersonal(this.situacion_docente["situaciones"], this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe(
      (encuesta: Object) => {
        // Realizar conversión de tipo a Pregunta[]
        this.encuesta = Object.values(encuesta) as Pregunta[];

        // Filtrar las preguntas numéricas
        this.encuesta = this.encuesta.filter(pregunta => pregunta.numerica === 1);
        this.encuesta = this.encuesta.filter(pregunta => pregunta.cod_pregunta !== "prg001");

        // Obtener los valores del array 'cuantos' de cada pregunta y almacenarlos en 'cuantos'
        this.encuesta.forEach(pregunta => {
          pregunta.cuantos = pregunta.respuestas.map((respuesta: any) => respuesta.cuantos);
  
          // Calcular la media de las respuestas
          const numerador = pregunta.respuestas.reduce((sum: number, respuesta: any) => sum + respuesta.cod_respuesta * respuesta.cuantos, 0);
          const denominador = pregunta.respuestas.reduce((sum: number, respuesta: any) => sum + respuesta.cuantos, 0);
          const media = denominador !== 0 ? numerador / denominador : 0;
          pregunta.media_respuestas = media !== 0 ? media.toFixed(2) : '-';
  
        });
        this.cargarComparativas();

      },
      (error) => {
        console.error(error);
      }
    );
  }

  cargarComparativas(){

    switch (this.selectedComparacion) {
      case 'asignatura.historico':
        this.getMediaAsignaturaHistorico();
      break;
      case 'asignatura':
        this.getMediaAsignatura();
      break;
      case 'grupo':
        this.getMediaGrupo();
      break;
      case 'departamento':
        this.getMediaDepartamento();
      break;
      case 'curso':
        this.getMediaCurso();
      break;
      case 'titulacion':
        this.getMediaTitulacion();
      break;
      case 'centro':
        this.getMediaCentro();
      break;
    }
  }


  // --------------- calculo de las diferenets medias comparativas del informe ----------------

  getMediaAsignaturaHistorico(){
    this.authService.getMediaAsignaturaHistorico(this.situacion_docente["asignatura"]["codigo"],this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {
      this.getMediaGeneral(res);
    });
  }

  getMediaAsignatura(){
    this.authService.getMediaAsignatura(this.situacion_docente["curso"]["año_curso"], this.situacion_docente["asignatura"]["codigo"],this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {
      this.getMediaGeneral(res);
    });
  }

  getMediaGrupo(){
    this.authService.getMediaGrupo(this.situacion_docente["curso"]["año_curso"],this.situacion_docente["grupo"]["codigo"],this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {
      this.getMediaGeneral(res);
    });
  }

  getMediaDepartamento(){
    this.authService.getMediaDepartamento(this.situacion_docente["curso"]["año_curso"],this.situacion_docente["departamento"]["codigo"],this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {
      this.getMediaGeneral(res);
    });
  }

  getMediaCurso(){
    this.authService.getMediaCurso(this.situacion_docente["curso"]["año_curso"],this.situacion_docente["curso"]["codigo"],this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {
      this.getMediaGeneral(res);
    });
  }

  getMediaTitulacion(){
    this.authService.getMediaTitulacion(this.situacion_docente["curso"]["año_curso"],this.situacion_docente["titulacion"]["codigo"],this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {
      this.getMediaGeneral(res);
    });
  }

  getMediaCentro(){
    this.authService.getMediaCentro(this.situacion_docente["curso"]["año_curso"],this.situacion_docente["centro"]["codigo"],this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {
      this.getMediaGeneral(res);
    });
  }

  getMediaGeneral(res:any){
    this.comparativa=res;

    // Realizar conversión de tipo a Pregunta[]
    this.comparativa = Object.values(res) as Pregunta[];

    // Filtrar las preguntas numéricas
    this.comparativa = this.comparativa.filter(pregunta => pregunta.numerica === 1);
    this.comparativa = this.comparativa.filter(pregunta => pregunta.cod_pregunta !== "prg001");

    // Obtener los valores del array 'cuantos' de cada pregunta y almacenarlos en 'cuantos'
    this.comparativa.forEach(pregunta => {
      pregunta.cuantos = pregunta.respuestas.map((respuesta: any) => respuesta.cuantos);

      // Calcular la media de las respuestas
      const numerador = pregunta.respuestas.reduce((sum: number, respuesta: any) => sum + respuesta.cod_respuesta * respuesta.cuantos, 0);
      const denominador = pregunta.respuestas.reduce((sum: number, respuesta: any) => sum + respuesta.cuantos, 0);
      const media = denominador !== 0 ? numerador / denominador : 0;
      pregunta.media_respuestas = media !== 0 ? media.toFixed(2) : '-';

    });
    this.cargarGrafica();
  }
  
  cargarGrafica(){
    this.rdo_personales = this.encuesta.map(pregunta => pregunta.media_respuestas);
    this.rdo_media = this.comparativa.map(pregunta => pregunta.media_respuestas);
    this.encuestaCargada = true;
  }
}
