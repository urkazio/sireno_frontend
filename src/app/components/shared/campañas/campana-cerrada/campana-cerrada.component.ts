import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/languaje.service';
import { PopupfactoryService } from '../../../../services/popupfactory.service'

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
  veces_activada: number | null = null;
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
    private popupfactoryService: PopupfactoryService
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
  

  click() {
    this.popupfactoryService.openOkPoup(this.strings["popup.cerrada.head"], this.strings["popup.cerrada.body"]);
  }
}
