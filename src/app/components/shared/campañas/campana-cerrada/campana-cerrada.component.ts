import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/languaje.service';

@Component({
  selector: 'app-campana-cerrada',
  templateUrl: './campana-cerrada.component.html',
  styleUrls: ['./campana-cerrada.component.css']
})
export class CampanaCerradaComponent implements OnInit {

  nombreAsignatura: string = '';
  profesor: string = '';
  cod_campana: string = '';
  nombre_campana: string = '';
  fecha_fin: Date | null = null;
  abierta_antes: number | null = null;
  cod_encuesta: string = '';
  cod_situacion_docente: string = '';
  cod_asignatura: string = '';
  nombre_asignatura: string = '';
  cod_docente: string = '';
  nombre_docente: string = '';
  num_curso: number | null = null;
  anno_curso: string = '';
  fecha_fin_activacion: Date | null = null;
    
  strings: any; // Variable para almacenar los textos

  constructor(
    private languageService: LanguageService, // Servicio de idioma
  ) {}

  ngOnInit() {
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
  

  mostrarObjeto() {
    console.log({
      cod_campana: this.cod_campana,
      nombre_campana: this.nombre_campana,
      fecha_fin: this.fecha_fin,
      abierta_antes: this.abierta_antes,
      cod_encuesta: this.cod_encuesta,
      cod_situacion_docente: this.cod_situacion_docente,
      cod_asignatura: this.cod_asignatura,
      nombre_asignatura: this.nombre_asignatura,
      cod_docente: this.cod_docente,
      nombre_docente: this.nombre_docente,
      num_curso: this.num_curso,
      anno_curso: this.anno_curso,
      fecha_fin_activacion: this.fecha_fin_activacion
      // Agrega más propiedades según necesites
    });
  }
}
