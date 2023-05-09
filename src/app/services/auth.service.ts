import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  signIn(user:any){
    //devolver un obserbale que va a ser la consulta
    return this.http.post(`${this.URL}/user/signin`,user);
  }

  getRole(user:any){
    //devolver un obserbale que va a ser la consulta
    return this.http.post(`${this.URL}/user/getrole`,user);
  }

  logOut() {
    // Eliminar el token del localStorage u otras tareas relacionadas con cerrar sesión
    localStorage.removeItem('token');
    // Otras acciones que desees realizar al cerrar sesión
  }


  //
  isAuth():boolean{

    const token = localStorage.getItem('token');

    if(this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')){
      // si el token no existe o está expirado devolver false para evitar poder acceder al recurso
      return false;
    }
    return true;
  }

}
