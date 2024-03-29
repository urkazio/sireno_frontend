import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { IndexAdminsComponent } from './components/admins/index-admins/index-admins.component';
import { IndexDocentesComponent } from './components/docentes/index-docentes/index-docentes.component';
import { IndexAlumnosComponent } from './components/alumnos/index-alumnos/index-alumnos.component';
import { PopupRolesComponent } from './components/shared/popups/popup-roles-do-al/popup-roles-do-al.component';
import { Encuesta1Component } from './components/shared/encuestas/encuesta1/encuesta1.component';
import { EncuestaGuard } from './guards/encuesta.guard';
import { CampanasDocenteComponent } from './components/docentes/campanas-docente/campanas-docente.component';
import { IndexInformesComponent } from './components/docentes/index-informes/index-informes.component';
import { InformesPersonalesComponent } from './components/docentes/informes-personales/informes-personales.component';
import { BarraPorcentajeRespuestasComponent } from './components/shared/graficas/barra-porcentaje-respuestas/barra-porcentaje-respuestas.component'
import { GraficaLinearComponent } from './components/shared/graficas/grafica-linear/grafica-linear.component'
import { InformeHistoricoPreguntaComponent } from './components/docentes/informe-historico-pregunta/informe-historico-pregunta.component'
import { InformesComparativaComponent } from './components/docentes/informes-comparativa/informes-comparativa.component'
import { GraficaMediasComponent } from './components/shared/graficas/grafica-medias/grafica-medias.component'
import { EncuestasAdminComponent } from './components/admins/encuestas-admin/encuestas-admin.component'
import { ListadoEncuestasAdminComponent } from './components/admins/listado-encuestas-admin/listado-encuestas-admin.component'

//rutas que mapean el nombre del path de la url con el componente al que acceden
const routes: Routes = [
  { path:'login', component: LoginComponent, canActivate:[AuthGuard]},
  { path:'indexAdmins', component: IndexAdminsComponent, canActivate:[RoleGuard], data:{ expectedRole: '2' }},
  { path:'encuestasAdmins', component: EncuestasAdminComponent, canActivate:[RoleGuard], data:{ expectedRole: '2' }},
  { path:'encuestasAdmins', component: EncuestasAdminComponent, canActivate:[RoleGuard], data:{ expectedRole: '2' }},
  { path:'listadoEncuestas', component: ListadoEncuestasAdminComponent, canActivate:[RoleGuard], data:{ expectedRole: '2' }},
  { path:'indexAlumnos', component: IndexAlumnosComponent, canActivate:[RoleGuard], data:{ expectedRole: '1' }},
  {path: 'encuesta', component: Encuesta1Component, canActivate: [RoleGuard, EncuestaGuard], data: { expectedRole: '1' }},
  { path:'indexDocentes', component: IndexDocentesComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'campanasDocente', component: CampanasDocenteComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'indexInformes', component: IndexInformesComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'informesPersonales', component: InformesPersonalesComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'barraRespuestas', component: BarraPorcentajeRespuestasComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'graficaLinear', component: GraficaLinearComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'graficaMedias', component: GraficaMediasComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'informePregunta', component: InformeHistoricoPreguntaComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'informeComparativo', component: InformesComparativaComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'**', pathMatch: 'full', redirectTo: 'login'} // por defecto redirige al home
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  entryComponents: [ PopupRolesComponent ],
  providers: [EncuestaGuard] 

})
export class AppRoutingModule { }
