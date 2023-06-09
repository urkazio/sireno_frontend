import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../services/languaje.service';


@Component({
  selector: 'app-navbar-inicio',
  templateUrl: './navbar-inicio.component.html',
  styleUrls: ['./navbar-inicio.component.css']
})
export class NavbarInicioComponent {
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

  onLogoutClick() {
    this.authService.logOut(); // Realiza la operación de cierre de sesión
    this.router.navigate(["login"]); // Navega hacia la página de inicio de sesión
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token'); // Comprueba si existe un token en el almacenamiento local
    return token !== null; // Devuelve true si el usuario está autenticado (el token existe), de lo contrario devuelve false
  }

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang); // Cambia el idioma actual utilizando el servicio de idioma
  }
}