import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PrivateComponent } from './components/private/private.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

//rutas que mapean el nombre del path de la url con el componente al que acceden
const routes: Routes = [
  { path:'home', component: HomeComponent},
  { path:'private', component: PrivateComponent, canActivate:[AuthGuard]},
  { path:'admin', component: AdminComponent, canActivate:[RoleGuard], data:{ expectedRole: 'admin' }},
  { path:'login', component: LoginComponent},
  { path:'**', pathMatch: 'full', redirectTo: 'home'} // por defecto redirige al home
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
