import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
      this.router.navigate(['home']); // redirijir al user
    })
  }
}
