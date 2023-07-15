import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

// +++++++++++++++++ MODULES +++++++++++++++++ --> definicion de modulos y cosas
 
// El módulo FormsModule es un módulo incorporado de Angular que proporciona herramientas y directivas para trabajar con formularios en la aplicación
// basicamente para facilitar el trabajo a la hora de crear formularios
import { FormsModule } from '@angular/forms' 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http' 


// +++++++++++++++++ PROVIDERS +++++++++++++++++
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt' //servicio que permite decodioficar y verificar el valor del token desde el lado del servidor
import { TokenInterceptorService } from './services/token-interceptor.service';
import { IndexAlumnosComponent } from './components/alumnos/index-alumnos/index-alumnos.component';
import { IndexDocentesComponent } from './components/docentes/index-docentes/index-docentes.component';
import { IndexAdminsComponent } from './components/admins/index-admins/index-admins.component';
import { PopupRolesComponent } from './components/shared/popups/popup-roles-do-al/popup-roles-do-al.component';
import { PopupOkComponent } from './components/shared/popups/popup-ok/popup-ok.component';
import { PopupRolesDoAdComponent } from './components/shared/popups/popup-roles-do-ad/popup-roles-do-ad.component';
import { PopupRolesDoAlAdComponent } from './components/shared/popups/popup-roles-do-al-ad/popup-roles-do-al-ad.component';
import { NavbarInicioComponent } from './components/shared/navbars/navbar-inicio/navbar-inicio.component';
import { NavbarAlumnosComponent } from './components/shared/navbars/navbar-alumnos/navbar-alumnos.component';
import { NavbarAdminsComponent } from './components/shared/navbars/navbar-admins/navbar-admins.component';
import { NavbarDocentesComponent } from './components/shared/navbars/navbar-docentes/navbar-docentes.component';
import { CampanaAbiertaComponent } from './components/shared/campañas/campana-abierta/campana-abierta.component';
import { CampanaCerradaComponent } from './components/shared/campañas/campana-cerrada/campana-cerrada.component';
import { Encuesta1Component } from './components/shared/encuestas/encuesta1/encuesta1.component';
import { CampanasDocenteComponent } from './components/docentes/campanas-docente/campanas-docente.component';
import { CampanaDocenteComponent } from './components/shared/campañas/campana-docente/campana-docente.component';
import { CampanaDocenteAbiertaComponent } from './components/shared/campañas/campana-docente-abierta/campana-docente-abierta.component';
import { PopupFechaHoraComponent } from './components/shared/popups/popup-fecha-hora/popup-fecha-hora.component';
import { IndexInformesComponent } from './components/docentes/index-informes/index-informes.component';
import { InformesPersonalesComponent } from './components/docentes/informes-personales/informes-personales.component';
import { ComparativaResultadosComponent } from './components/docentes/comparativa-resultados/comparativa-resultados.component';
import { BarraPorcentajeRespuestasComponent } from './components/shared/graficas/barra-porcentaje-respuestas/barra-porcentaje-respuestas.component';
import { GraficaLinearComponent } from './components/shared/graficas/grafica-linear/grafica-linear.component';
import { InformeHistoricoPreguntaComponent } from './components/docentes/informe-historico-pregunta/informe-historico-pregunta.component';
import { InformesComparativaComponent } from './components/docentes/informes-comparativa/informes-comparativa.component';
import { GraficaMediasComponent } from './components/shared/graficas/grafica-medias/grafica-medias.component';
import { EncuestasAdminComponent } from './components/admins/encuestas-admin/encuestas-admin.component';
import { ListadoEncuestasAdminComponent } from './components/admins/listado-encuestas-admin/listado-encuestas-admin.component';
import { CampanaAdminComponent } from './components/shared/campañas/campana-admin/campana-admin.component';
import { CampanaAdminAbiertaComponent } from './components/shared/campañas/campana-admin-abierta/campana-admin-abierta.component';
import { PopupMensajeComponent } from './components/shared/popups/popup-mensaje/popup-mensaje.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexAlumnosComponent,
    IndexDocentesComponent,
    IndexAdminsComponent,
    PopupRolesComponent,
    PopupOkComponent,
    PopupRolesDoAdComponent,
    PopupRolesDoAlAdComponent,
    NavbarInicioComponent,
    NavbarAlumnosComponent,
    NavbarAdminsComponent,
    NavbarDocentesComponent,
    CampanaAbiertaComponent,
    CampanaCerradaComponent,
    Encuesta1Component,
    CampanasDocenteComponent,
    CampanaDocenteComponent,
    CampanaDocenteAbiertaComponent,
    PopupFechaHoraComponent,
    IndexInformesComponent,
    InformesPersonalesComponent,
    ComparativaResultadosComponent,
    BarraPorcentajeRespuestasComponent,
    GraficaLinearComponent,
    InformeHistoricoPreguntaComponent,
    InformesComparativaComponent,
    GraficaMediasComponent,
    EncuestasAdminComponent,
    ListadoEncuestasAdminComponent,
    CampanaAdminComponent,
    CampanaAdminAbiertaComponent,
    PopupMensajeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    // JWT
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    // TOKEN INTERCEPTOR
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
