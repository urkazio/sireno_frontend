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
    const username = {
      user: user
    };

    return this.http.post(`${this.URL}/user/getrole`,username);
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

  //---------------------------------- alumnos  ----------------------------------------------

  getCampanas(){
    return this.http.post(`${this.URL}/alumno/getCampannas`, {});
  }

  getEncuesta(cod_encuesta:string, idioma:string){

    const datos_encuesta = {
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };

    return this.http.post(`${this.URL}/alumno/getEncuesta`, datos_encuesta);
  }

  getSDsAlumno(){
    return this.http.post(`${this.URL}/alumno/getSDsAlumno`, {});
  }

  isActiva(cod_situacion_docente:string){
    return this.http.post(`${this.URL}/alumno/isActiva`, cod_situacion_docente);
  }

  enviarRespuestasAlumno(respuestas:any, cod_situacion_docente:string){

    const datos_respuesta = {
      respuestas : respuestas,
      cod_situacion_docente : cod_situacion_docente
    };
    
    const exitoso = this.http.post(`${this.URL}/alumno/setRespuestas`, datos_respuesta);
    return exitoso;
  }

  //---------------------------------- docentes ----------------------------------------------

  getCampannasDocente(){
    return this.http.post(`${this.URL}/docente/getCampannas`, {});
  }


  abrirCampanna(situaciones:any, fechaHoraFinActivacion:any){

    console.log(situaciones +" -- "+ fechaHoraFinActivacion);

    const datos_activacion = {
      situaciones : situaciones,
      fechaHoraFinActivacion : fechaHoraFinActivacion
    };

    return this.http.post(`${this.URL}/docente/abrirCampanna`, datos_activacion);
  }

  prueba(){
    this.http.post(`${this.URL}/docente/prueba`, {});
  }

}
