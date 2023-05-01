import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// importar el servicio de decodificacion
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, public router: Router){ }
  
  canActivate(route: ActivatedRouteSnapshot):boolean{
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('token');

    if (token !== null) {

      // {usuario: 'urko', rol: 'alumno'}

      interface MiUsuario {
        usuario: string;
        rol: string;
      }
      
      const decoded = decode(token) as MiUsuario;
      const { usuario, rol } = decoded;

      // comprobar si esta autentiucado y ademas el rol es el adecuado
      if(!this.authService.isAuth() || rol !== expectedRole){
        console.log('Usuario no autorizado');
        this.router.navigate(["login"]);
        return false;
      }
      return true;
    }else{  
      console.log('La sesión ha expirado');
      this.router.navigate(["login"]);
      return false;
    }
  
  }  
}
