import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-encuestas-admin',
  templateUrl: './encuestas-admin.component.html',
  styleUrls: ['./encuestas-admin.component.css']
})
export class EncuestasAdminComponent implements OnInit{
  strings: any; // Variable para almacenar los textos

  constructor(
    private languageService: LanguageService, // Servicio de idioma
    private router: Router, // Router para redirigir al usuario
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

  navigateEncuestasAdmin(){
    this.router.navigate(['listadoEncuestas']);
  }
}
