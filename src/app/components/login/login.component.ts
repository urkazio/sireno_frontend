import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


import decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{

  user={
    user: 'urko', //valores por defecto para el objeto user
    pass: '123'
  }

  constructor(
    private authService: AuthService, // importar el servicio auth.services que tiene el metodo de login
    private router: Router //objeto router para poder redirigir al usuario una vez logeado

  ){}

  ngOnInit(){    
  }

  logIn(){
    //al hacer click en el login se consume el servicio
    this.authService.signIn(this.user).subscribe((res:any) =>{
      // si el login es correcto se debe guardar el token obtenido en localStorage
      localStorage.setItem('token', res);
      this.redirigirTrasLogin();
      //this.router.navigate(['home']); // redirijir al user
    })
  }

  redirigirTrasLogin(){

    const token = localStorage.getItem('token');

    if (token !== null) {

      // {usuario: 'urko', rol: 'alumno'}

      interface MiUsuario {
        usuario: string;
        rol: string;
      }
      
      const decoded = decode(token) as MiUsuario;
      const { usuario, rol } = decoded;

      // comprobar si esta autentiucado
      if(!this.authService.isAuth()){
        console.log('Usuario no autorizado');
        this.router.navigate(["login"]);
        

      }else{

        if (rol=="admin"){
          console.log('Bienvenido admin');
          this.router.navigate(["indexAdmins"]);

        }else if (rol=="docente"){
          console.log('Bienvenido docente');
          this.router.navigate(["indexDocentes"]);

        }else if (rol=="alumno"){
          console.log('Bienvenido alumno');
          this.router.navigate(["indexAlumnos"]);
          
        }else{
          this.router.navigate(["login"]);
        }
      }

    }else{  
      console.log('La sesión ha expirado');
      this.router.navigate(["login"]);
    }
  }

}
