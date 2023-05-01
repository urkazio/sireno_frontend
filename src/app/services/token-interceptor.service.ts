import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  //interceptar las peticiones y añadir de manera manual el token con su cabecera
  intercept(req:any, next:any) {

    const token = localStorage.getItem('token')
    const tokenHeader = req.clone({
      setHeders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(tokenHeader);
  }

  constructor() { }
}
