import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from '../../services/languaje.service';
import { PopupfactoryService } from '../../services/popupfactory.service';




import decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  strings: any; // Variable para almacenar los textos
  contrasenaIncorrecta: boolean = false;
  user = {
    user: 'alum000', // Valores por defecto para el objeto user, cambiar a valores vacíos posteriormente
    pass: '123',
    rol: ''
  };

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para redirigir al usuario
    private languageService: LanguageService, // Servicio de idioma
    private popupfactoryService: PopupfactoryService  // factoria de popUps encargada de la gestion
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

    // esta llamada obtiene el rol asociado al usuario que se intenta identificar
    // en caso de que un usuario tenga varios roles, debe elegir uno de ellos
    this.authService.getRole(this.user.user).subscribe((role: any) => {
      
      console.log("role: "+role)
      
      switch (role) {

        case '0': //Docente
        this.user.rol = "0";
        this.logInWithRole();
        break;

        case '1': //Alumno
          this.user.rol = "1";
          this.logInWithRole();
          break;

        case '2': //Admin
          this.user.rol = "2";
          this.logInWithRole();
          break;

        case '3': //Docente y Alumno
          this.popupfactoryService.openPopupRoles_do_al().then((pref_rol: string) => {
            this.user.rol = pref_rol;
            this.logInWithRole();
          });
          break;

        case '4': //Docente y Admin
          this.popupfactoryService.openPopupRoles_do_ad().then((pref_rol: string) => {
            this.user.rol = pref_rol;
            this.logInWithRole();
          });
          break;

        case '5': //Docente, Alumno y Admin
          this.popupfactoryService.openPopupRoles_do_al_ad().then((pref_rol: string) => {
            this.user.rol = pref_rol;
            this.logInWithRole();
          });
          break;
        
      }

    
    });
  }


  logInWithRole(){
    
      // Al hacer clic en el botón de login se consume el servicio de autenticación
      this.authService.signIn(this.user).subscribe((res: any) => {

        if(res == 'Usuario o clave incorrectos'){
          this.contrasenaIncorrecta = true; // Establece la variable a true en caso de error
        }else{
          localStorage.setItem('token', res); //se guarda el token obtenido en localStorage
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
      const { rol } = decoded; // Extrae el usuario y el rol del objeto 'decoded'

      // Comprobar si está autenticado
      if (!this.authService.isAuth()) {
        console.log('Usuario no autorizado');
        this.router.navigate(['login']);
      } else {

        // Comprobar los roles y redirigir según el rol del usuario
        switch (rol) {

          case '0': //Docente
            console.log('Bienvenido docente');
            this.router.navigate(['indexDocentes']);
            break;

          case '1': //Alumno
            console.log('Bienvenido alumno');
            this.router.navigate(['indexAlumnos']);
            break;

          case '2': //Admin
            console.log('Bienvenido admin');
            this.router.navigate(['indexAdmins']);
            break;

        }
      }

    } else {
      console.log('La sesión ha expirado');
      this.router.navigate(['login']);
    }
  }

}
