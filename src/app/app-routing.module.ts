import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { IndexAdminsComponent } from './components/index-admins/index-admins.component';
import { IndexDocentesComponent } from './components/index-docentes/index-docentes.component';
import { IndexAlumnosComponent } from './components/index-alumnos/index-alumnos.component';

//rutas que mapean el nombre del path de la url con el componente al que acceden
const routes: Routes = [
  { path:'login', component: LoginComponent},
  { path:'indexAlumnos', component: IndexAlumnosComponent, canActivate:[RoleGuard], data:{ expectedRole: 'alumno' }},
  { path:'indexDocentes', component: IndexDocentesComponent, canActivate:[RoleGuard], data:{ expectedRole: 'docente' }},
  { path:'indexAdmins', component: IndexAdminsComponent, canActivate:[RoleGuard], data:{ expectedRole: 'admin' }},
  { path:'**', pathMatch: 'full', redirectTo: 'home'} // por defecto redirige al home
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
