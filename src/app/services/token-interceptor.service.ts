import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  //interceptar las peticiones y añadir de manera manual el token con su cabecera
  intercept(req:any, next:any) {

    const token = localStorage.getItem('token')
    const tokenHeader = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(tokenHeader);
  }

  constructor() { }
}
