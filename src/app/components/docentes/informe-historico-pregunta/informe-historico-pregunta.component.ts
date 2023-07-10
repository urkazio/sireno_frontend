import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';

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

  constructor(
    private languageService: LanguageService,
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


    this.cod_pregunta = localStorage.getItem('cod_pregunta') || "";
    this.cod_situacion_docente = localStorage.getItem('cod_situacion_docente') || "";
    this.texto_pregunta = localStorage.getItem('texto_pregunta') || "";

    localStorage.removeItem('cod_pregunta');
    localStorage.removeItem('cod_situacion_docente');
    localStorage.removeItem('texto_pregunta');

    this.parametrosGrafica = {
      cod_pregunta: this.cod_pregunta,
      cod_situacion_docente: this.cod_situacion_docente,
      texto_pregunta: this.texto_pregunta
    };
    
}

}
