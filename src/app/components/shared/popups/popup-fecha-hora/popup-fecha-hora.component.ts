import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from '../../../../services/languaje.service';

@Component({
  selector: 'app-popup-fecha-hora',
  templateUrl: './popup-fecha-hora.component.html',
  styleUrls: ['./popup-fecha-hora.component.css']
})
export class PopupFechaHoraComponent {
  @Input() title: string = '';;
  @Input() mensaje: string = '';;
  strings: any; // Variable para almacenar los textos


  constructor(
    public activeModal: NgbActiveModal,
    private languageService: LanguageService // Servicio de idioma
    ) {}

    ngOnInit() {
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

  onCancel() {
    this.activeModal.dismiss();
  }
 
  onSaveChanges() {
    this.activeModal.close();
  }

}
