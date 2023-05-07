import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage: BehaviorSubject<string> = new BehaviorSubject<string>('es'); // BehaviorSubject para almacenar el idioma actual con valor inicial 'es'
  public currentLanguage$ = this.currentLanguage.asObservable(); // Observable que permite suscribirse y recibir actualizaciones del idioma actual

  constructor(private http: HttpClient) { }

  loadStrings(lang: string) {
    return this.http.get<any>(`assets/strings-${lang}.json`); // Carga el archivo de strings correspondiente al idioma indicado y devuelve el resultado
  }

  changeLanguage(lang: string) {
    this.currentLanguage.next(lang); // Actualiza el idioma actual con el valor proporcionado
  }
}
