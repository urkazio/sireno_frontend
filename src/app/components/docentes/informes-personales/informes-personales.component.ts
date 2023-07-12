import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { AuthService } from '../../../services/auth.service';
import { DataSharingService } from '../../../services/data.service';


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
  selector: 'app-informes-personales',
  templateUrl: './informes-personales.component.html',
  styleUrls: ['./informes-personales.component.css']
})

export class InformesPersonalesComponent implements OnInit{
  
  colors: string[] = ['red', 'blue', 'green', 'yellow', 'orange'];
  encuesta: any[] = [];
  strings: any; // Variable para almacenar los textos
  asignaturas: any[]  = [];
  selectedAsignatura: Asignatura | null = null;
  selectedYear: any;
  selectedYearDrop: boolean = false;
  situacion_docente: any;
  datos_informe: boolean = false;
  encuestaCargada: boolean = false;
  historicoPregunta: Respuesta[] = [];

  constructor(
    private languageService: LanguageService, // Servicio de idioma
    private authService: AuthService,
    private dataSharingService: DataSharingService
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
        this.encuestaCargada = true;

        // Filtrar las preguntas numéricas
        this.encuesta = this.encuesta.filter(pregunta => pregunta.numerica === 1);

        // Obtener los valores del array 'cuantos' de cada pregunta y almacenarlos en 'cuantos'
        this.encuesta.forEach(pregunta => {
          pregunta.cuantos = pregunta.respuestas.map((respuesta: any) => respuesta.cuantos);
        });

      },
      (error) => {
        console.error(error);
      }
    );
  }


  mostrarGraficoPregunta(cod_pregunta: string, texto_pregunta: string) {
    
    this.authService.getHistoricoPregunta(this.situacion_docente["asignatura"]["codigo"], cod_pregunta, this.languageService.getCurrentLanguageValue()).subscribe((res: any) => {

      this.historicoPregunta = res;

      localStorage.setItem('cod_pregunta', cod_pregunta);
      localStorage.setItem('cod_situacion_docente', this.situacion_docente["situaciones"]);
      localStorage.setItem('texto_pregunta', texto_pregunta);
      localStorage.setItem('cod_asignatura', this.situacion_docente["asignatura"]["codigo"]);
      localStorage.setItem('info_respuestas', res);
      localStorage.setItem('info_respuestas', JSON.stringify(this.historicoPregunta));

      const newTab = window.open('informePregunta', '_blank');
      newTab?.focus();

    });

    
    
  }
    
}
