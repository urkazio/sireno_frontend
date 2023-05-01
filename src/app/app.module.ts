import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PrivateComponent } from './components/private/private.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';

// +++++++++++++++++ MODULES +++++++++++++++++ --> definicion de modulos y cosas
 
// El módulo FormsModule es un módulo incorporado de Angular que proporciona herramientas y directivas para trabajar con formularios en la aplicación
// basicamente para facilitar el trabajo a la hora de crear formularios
import { FormsModule } from '@angular/forms' 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http' 


// +++++++++++++++++ PROVIDERS +++++++++++++++++
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt' //servicio que permite decodioficar y verificar el valor del token desde el lado del servidor
import { TokenInterceptorService } from './services/token-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PrivateComponent,
    AdminComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    // JWT
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    // TOKEN INTERCEPTOR
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
