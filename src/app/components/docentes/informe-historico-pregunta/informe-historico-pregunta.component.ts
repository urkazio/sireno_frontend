import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-informe-historico-pregunta',
  templateUrl: './informe-historico-pregunta.component.html',
  styleUrls: ['./informe-historico-pregunta.component.css']
})
export class InformeHistoricoPreguntaComponent implements OnInit {
  parametrosGrafica: any;
  strings: any;
  cod_pregunta: string = "";
  cod_situacion_docente: string = "";
  texto_pregunta: string = "";
  cod_asignatura: string = "";
  info_respuestas: any;


  constructor(
    private languageService: LanguageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const lang = 'es';
    this.languageService.currentLanguage$.subscribe(lang => {
      this.languageService.loadStrings(lang).subscribe(
        data => {
          this.strings = data;
        },
        error => {
          console.error(`Error loading strings for ${lang}:`, error);
        }
      );
    });

    //obtener los parametros pasados por el local storage
    this.cod_pregunta = localStorage.getItem('cod_pregunta') || "";
    this.cod_situacion_docente = localStorage.getItem('cod_situacion_docente') || "";
    this.texto_pregunta = localStorage.getItem('texto_pregunta') || "";
    this.cod_asignatura = localStorage.getItem('cod_asignatura') || "";
    this.info_respuestas = localStorage.getItem('info_respuestas') || "";

    //borrara los parametros del local storage
    localStorage.removeItem('cod_pregunta');
    localStorage.removeItem('cod_situacion_docente');
    localStorage.removeItem('texto_pregunta');
    localStorage.removeItem('cod_asignatura');
    localStorage.removeItem('info_respuestas');


    this.parametrosGrafica = {
      cod_pregunta: this.cod_pregunta,
      cod_situacion_docente: this.cod_situacion_docente,
      texto_pregunta: this.texto_pregunta,
      cod_asignatura: this.cod_asignatura,
      info_respuestas: this.info_respuestas
    };

}

}
