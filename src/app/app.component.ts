import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from '../app/services/languaje.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sireno_frontend';
  strings: any; // Variable para almacenar los textos

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para navegar entre las páginas
    private languageService: LanguageService // Servicio de idioma
  ) { }

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
}