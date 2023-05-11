import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { IndexAdminsComponent } from './components/admins/index-admins/index-admins.component';
import { IndexDocentesComponent } from './components/docentes/index-docentes/index-docentes.component';
import { IndexAlumnosComponent } from './components/alumnos/index-alumnos/index-alumnos.component';
import { PopupRolesComponent } from './components/shared/popups/popup-roles-do-al/popup-roles-do-al.component';

//rutas que mapean el nombre del path de la url con el componente al que acceden
const routes: Routes = [
  { path:'login', component: LoginComponent, canActivate:[AuthGuard]},
  { path:'indexAlumnos', component: IndexAlumnosComponent, canActivate:[RoleGuard], data:{ expectedRole: '1' }},
  { path:'indexDocentes', component: IndexDocentesComponent, canActivate:[RoleGuard], data:{ expectedRole: '0' }},
  { path:'indexAdmins', component: IndexAdminsComponent, canActivate:[RoleGuard], data:{ expectedRole: '2' }},
  { path:'**', pathMatch: 'full', redirectTo: 'login'} // por defecto redirige al home
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  entryComponents: [ PopupRolesComponent ]
})
export class AppRoutingModule { }
