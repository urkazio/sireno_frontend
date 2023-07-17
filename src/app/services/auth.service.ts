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
    const datos_respuesta = {
      cod_situacion_docente : cod_situacion_docente
    };
    return this.http.post(`${this.URL}/alumno/isActiva`, datos_respuesta);
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

    const datos_activacion = {
      situaciones : situaciones,
      fechaHoraFinActivacion : fechaHoraFinActivacion
    };
    return this.http.post(`${this.URL}/docente/abrirCampanna`, datos_activacion);
  }

  desactivarCampana(situaciones: any, fecha_hora_cierre: any){

    const datos_desactivacion = {
      situaciones : situaciones,
      fecha_hora_cierre: fecha_hora_cierre
    };
    return this.http.post(`${this.URL}/docente/desactivarCampana`, datos_desactivacion);
  }

  getRespondidos(situaciones: any){

    const datos_sd = {
      situaciones : situaciones,
    };
    return this.http.post(`${this.URL}/docente/getRespondidos`, datos_sd);
  }

  getAsignaturasPublicadas(){
    return this.http.post(`${this.URL}/docente/getAsignaturasPublicadas`, {});
  }

  getDatosSD(situaciones: any){

    const datos_sd = {
      situaciones : situaciones,
    };
    return this.http.post(`${this.URL}/docente/getDatosSD`, datos_sd);
  }

  getResultadosInformePersonal(situaciones:string, cod_encuesta:string, idioma:string){

    const datos_encuesta = {
      situaciones : situaciones,
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getResultadosInformePersonal`, datos_encuesta);
  }

  getHistoricoPregunta(cod_asignatura:string, cod_pregunta:string, idioma:string){

    const datos_encuesta = {
      cod_asignatura : cod_asignatura,
      cod_pregunta : cod_pregunta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getHistoricoPregunta`, datos_encuesta);
  }

// ---------- getters de la media de un conjunto de situaciones docnetyes para la comparativa de informes ----------

 getMediaAsignatura(cod_asignatura:string, cod_encuesta:string, idioma:string){

    const datos_encuesta = {
      cod_asignatura : cod_asignatura,
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getMediaAsignatura`, datos_encuesta);
  }

  getMediaGrupo(cod_grupo:string, cod_encuesta:string, idioma:string){
    
    const datos_encuesta = {
      cod_grupo : cod_grupo,
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getMediaGrupo`, datos_encuesta);
  }

  getMediaDepartamento(cod_departamento:string, cod_encuesta:string, idioma:string){

    const datos_encuesta = {
      cod_departamento : cod_departamento,
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getMediaDepartamento`, datos_encuesta);
  }

  getMediaCurso(cod_curso:string, cod_encuesta:string, idioma:string){

    const datos_encuesta = {
      cod_curso : cod_curso,
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getMediaCurso`, datos_encuesta);
  }

  getMediaTitulacion(cod_titulacion:string, cod_encuesta:string, idioma:string){

    const datos_encuesta = {
      cod_titulacion : cod_titulacion,
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getMediaTitulacion`, datos_encuesta);
  }

  getMediaCentro(cod_centro:string, cod_encuesta:string, idioma:string){

    const datos_encuesta = {
      cod_centro : cod_centro,
      cod_encuesta : cod_encuesta,
      idioma : idioma
    };
    return this.http.post(`${this.URL}/docente/getMediaCentro`, datos_encuesta);
  }

  //---------------------------------- admins  ----------------------------------------------

  getCampanasAdmin(año_curso:string, ratio_respuestas:any,){
    const datos_activacion = {
      año_curso : año_curso,
      ratio_respuestas : ratio_respuestas,
    };
    return this.http.post(`${this.URL}/admin/getCampannas`, datos_activacion);
  }

  getAnnosCampañas(){
    return this.http.post(`${this.URL}/admin/getAnnosCursos`, {});
  }

  getRespondidosAdmin(situaciones: any){

    const datos_sd = {
      situaciones : situaciones,
    };
    return this.http.post(`${this.URL}/admin/getRespondidos`, datos_sd);
  }

  desactivarCampanaAdmin(situaciones: any, fecha_hora_cierre: any){

    const datos_desactivacion = {
      situaciones : situaciones,
      fecha_hora_cierre: fecha_hora_cierre
    };
    return this.http.post(`${this.URL}/admin/desactivarCampana`, datos_desactivacion);
  }
  
  abrirCampannaAdmin(mensaje:string, situaciones:any, fechaHoraFinActivacion:any){
    const datos_activacion = {
      situaciones : situaciones,
      fechaHoraFinActivacion : fechaHoraFinActivacion
    };
    return this.http.post(`${this.URL}/admin/abrirCampannaAdmin`, datos_activacion);
  }

  mandarMensajeApertura(mensaje:string, situaciones:any){
    const datos_activacion = {
      mensaje : mensaje,
      situaciones : situaciones
    };
    return this.http.post(`${this.URL}/admin/mandarMensajeApertura`, datos_activacion);
  }
}
