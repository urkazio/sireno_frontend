import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PopupComponent } from '../popup/popup.component';
import { LanguageService } from '../../services/languaje.service';

import decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  strings: any; // Variable para almacenar los textos
  popup: PopupComponent = new PopupComponent();
  contrasenaIncorrecta: boolean = false;
  user = {
    user: '', // Valores por defecto para el objeto user, cambiar a valores vacíos posteriormente
    pass: ''
  };

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para redirigir al usuario
    private languageService: LanguageService // Servicio de idioma
  ) {}

  ngOnInit() {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.loadStrings(lang);
    });
  }

  loadStrings(lang: string) {
    this.languageService.loadStrings(lang).subscribe(
      data => {
        this.strings = data; // Almacena los textos cargados en la variable 'strings'
      },
      error => {
        console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
      }
    );
  }

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang); // Cambia el idioma actual utilizando el servicio de idioma
  }

  logIn() {
    // Al hacer clic en el botón de login se consume el servicio de autenticación
    this.authService.signIn(this.user).subscribe((res: any) => {
      if (res === 'Usuario o clave incorrectos') {
        // Realiza las acciones necesarias en caso de error
        this.contrasenaIncorrecta = true; // Establece la variable a true en caso de error
        this.openPopup();
      } else {
        // Si el login es correcto, se guarda el token obtenido en localStorage
        localStorage.setItem('token', res);
        this.redirigirTrasLogin();
      }
    });
  }

  redirigirTrasLogin() {
    const token = localStorage.getItem('token');

    if (token !== null) {
      // Interfaz para el objeto decodificado del token
      interface MiUsuario {
        usuario: string;
        rol: string;
      }

      const decoded = decode(token) as MiUsuario; // Decodifica el token y lo asigna al objeto 'decoded'
      const { usuario, rol } = decoded; // Extrae el usuario y el rol del objeto 'decoded'

      // Comprobar si está autenticado
      if (!this.authService.isAuth()) {
        console.log('Usuario no autorizado');
        this.router.navigate(['login']);
      } else {
        // Comprobar los roles y redirigir según el rol del usuario
        if (rol == '0') {
          console.log('Bienvenido docente');
          this.router.navigate(['indexDocentes']);
        } else if (rol == '1') {
          console.log('Bienvenido alumno');
          this.router.navigate(['indexAlumnos']);
        } else if (rol == '2') {
          console.log('Bienvenido admin');
          this.router.navigate(['indexAdmins']);
        } else {
          this.router.navigate(['login']);
        }
      }
    } else {
      console.log('La sesión ha expirado');
      this.router.navigate(['login']);
    }
  }
      
  openPopup() {
    this.popup = new PopupComponent(); // Crear una instancia del componente popup
    // Lógica adicional para configurar el componente popup si es necesario
    this.popup.open(); // Abrir el componente popup
  }

}
