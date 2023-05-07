import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
// importar el servicio de decodificacion
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){

  }

  // el login solo es accesible si el token es null (no hay token)
  canActivate():boolean{
    const token = localStorage.getItem('token');
    if (token==null){
      return true;
    }else{
      return false;
    }
  }
}
