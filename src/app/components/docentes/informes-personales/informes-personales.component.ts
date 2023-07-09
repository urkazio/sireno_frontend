import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


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
}


@Component({
  selector: 'app-informes-personales',
  templateUrl: './informes-personales.component.html',
  styleUrls: ['./informes-personales.component.css']
})

export class InformesPersonalesComponent implements OnInit{

  encuesta: any[] = [];
  strings: any; // Variable para almacenar los textos
  asignaturas: any[]  = [];
  selectedAsignatura: Asignatura | null = null;
  selectedYear: any;
  selectedYearDrop: boolean = false;
  situacion_docente: any;
  datos_informe: boolean = false;
  encuestaCargada: boolean = false;

  constructor(
    private languageService: LanguageService, // Servicio de idioma
    private router: Router, // Router para redirigir al usuario
    private authService: AuthService
  ) {}

  
  ngOnInit() {
    const lang = 'es'; // Idi oma predeterminado
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
        console.log(res)

        if(res!='No se encontraron datos.'){
          this.datos_informe=true;
          this.situacion_docente=res;
          this.cargarEncuesta();
        }
      });
    }
  }

  cargarEncuesta() {

    this.authService.getResultadosInformePersonal(this.situacion_docente["situaciones"], this.situacion_docente["encuesta"], this.languageService.getCurrentLanguageValue()).subscribe(
      (encuesta: Object) => {
        console.log(encuesta);

        
        // Realizar conversión de tipo a Pregunta[]
        this.encuesta = encuesta as Pregunta[];
  
        // Filtrar las preguntas numéricas
        this.encuesta = this.encuesta.filter(pregunta => pregunta.numerica === 1);
  
        this.encuestaCargada = true;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  
  
  

}
