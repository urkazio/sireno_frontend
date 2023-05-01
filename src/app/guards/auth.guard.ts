import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){

  }

  canActivate():boolean{

    if(!this.authService.isAuth()){

      console.log('La sesión ha expirado');
      // redirigir a la pantalla de login en caso de no tener token valido
      this.router.navigate(['login']); 
      return false;
    }

    return true;
  }
  
}
