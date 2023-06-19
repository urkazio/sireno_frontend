import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { AuthService } from 'src/app/services/auth.service';
import { CampanaDocenteComponent } from '../../shared/campañas/campana-docente/campana-docente.component';

@Component({
  selector: 'app-campanas-docente',
  templateUrl: './campanas-docente.component.html',
  styleUrls: ['./campanas-docente.component.css']
})
export class CampanasDocenteComponent implements OnInit{

  noHayCampanasValidas: boolean = true;
  strings: any; // Variable para almacenar los textos

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private languageService: LanguageService, // Servicio de idioma
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,

  ) {}

  ngOnInit() {

    this.getCampannasDocente();

    const lang = 'es'; // Idioma predeterminado
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

  }

  getCampannasDocente(){
    this.authService.getCampannasDocente().subscribe((res: any) => {

      //limpiar el contenedor de componentes
      this.viewContainerRef.clear();

      // Crear un componente campana-abierta por cada campaña
      res.forEach((campana: any) => {
      let factory;
      let componentRef;
      let instance;
      this.noHayCampanasValidas=false;


      factory = this.resolver.resolveComponentFactory(CampanaDocenteComponent);
      componentRef = this.viewContainerRef.createComponent(factory);
      instance = componentRef.instance as CampanaDocenteComponent;


      instance.cod_situacion_docente = campana.cod_situacion_docente;
      instance.n_alum_total = campana.n_alum_total;
      instance.n_alum_respondido = campana.n_alum_respondido;
      instance.nombre_Asignatura = campana.nombre_Asignatura;
      instance.fecha_fin = new Date(campana.fecha_fin);
      instance.num_curso = campana.num_curso;
      instance.anno_curso = campana.año_curso;
      instance.veces_abierta = campana.activada;

      // Agregar el componente al contenedor
      const container = document.createElement('div');
      container.classList.add('container', 'mt-5', 'col-12', 'col-md-5');
      container.style.marginBottom = '40px'; // Ajusta el valor según el margen deseado
      container.style.marginTop = '150px';
      container.appendChild(componentRef.location.nativeElement);
      this.viewContainerRef.element.nativeElement.appendChild(container);
    });
  });
}
}
