import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { DataSharingService } from '../services/data.service';

@Injectable()
export class EncuestaGuard implements CanActivate {

  cod_encuesta: string = '';
  encuesta: any[] = [];
  nombre_encuesta : string = '';
  cod_situacion_docente : string = '';
  nombreAsignatura : string = '';
  nombre_docente : string = '';
  fecha_fin_activacion: Date | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataSharingService: DataSharingService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Obtener los parámetros del servicio DataSharingService
    const parametros = this.dataSharingService.getData('parametrosEncuesta');

    if (parametros) {
      this.cod_encuesta = parametros.cod_encuesta;
      this.fecha_fin_activacion = parametros.fecha_fin_activacion;
      this.cod_situacion_docente = parametros.cod_situacion_docente;
      this.nombreAsignatura = parametros.nombreAsignatura;
      this.nombre_docente = parametros.nombre_docente;
    }

    if (this.cod_situacion_docente && this.nombreAsignatura && this.nombre_docente && this.fecha_fin_activacion && this.cod_encuesta) {
      // Obtener la lista de cod_situaciones del servicio
      return this.authService.getSDsAlumno().pipe(
        map((situaciones_docentes: Object) => {
          // Verificar si cod_situacion_docente está en la lista
          if (Object.values(situaciones_docentes).includes(this.cod_situacion_docente)) {
            return true;
          } else {
            // Si cod_situacion_docente no está en la lista, redirigir al usuario
            this.router.navigate(['indexAlumnos']);
            return false;
          }
        }),
        take(1) // Tomar solo el primer valor y completar el Observable
      );
    }

    this.router.navigate(['indexAlumnos']);
    return false;
  }
}
