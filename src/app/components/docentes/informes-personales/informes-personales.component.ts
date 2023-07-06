import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informes-personales',
  templateUrl: './informes-personales.component.html',
  styleUrls: ['./informes-personales.component.css']
})



export class InformesPersonalesComponent implements OnInit{

  
  strings: any; // Variable para almacenar los textos
  asignaturas: any[]  = [];
  selectedAsignatura: { nombre_asignatura: string, anio: string } | null = null;
  selectedYear: any;
  selectedYearDrop: boolean = false;


  constructor(
    private languageService: LanguageService, // Servicio de idioma
    private router: Router, // Router para redirigir al usuario
    private authService: AuthService
  ) {}

  
  ngOnInit() {
    const lang = 'es'; // Idi oma predeterminado
    this.languageService.currentLanguage$.subscribe(lang => { // Suscripción a cambios en el idioma actual
      this.languageService.loadStrings(lang).subscribe( // Carga los strings correspondientes al idioma actual
        data => {
          this.strings = data; // Almacena los textos cargados en la variable 'strings'
        },
        error => {
          console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
        }
      );
    });
    this.getAsignaturasAñoDocente();
  }

  getAsignaturasAñoDocente(){
    this.authService.getAsignaturasPublicadas().subscribe((res: any) => {
      this.asignaturas = res;
    });
  }

  selectAsignatura(asignatura: any) {
    this.selectedAsignatura = asignatura;
    this.selectedYear = null;
  }

  getAsignaturaYears(asignatura: any): string[] {
    const years: string[] = [];
  
    for (const key in asignatura) {
      if (key !== 'nombre_asignatura') {
        years.push(key);
      }
    }
  
    this.selectedYearDrop = true;
    return years;
  }

mostrarInforme(){
}

}
