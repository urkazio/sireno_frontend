import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from '../../../services/languaje.service';
import { CampanaAbiertaComponent } from '../../shared/campañas/campana-abierta/campana-abierta.component';
import { CampanaCerradaComponent } from '../../shared/campañas/campana-cerrada/campana-cerrada.component';
import { PopupfactoryService } from '../../../services/popupfactory.service';


@Component({
  selector: 'app-index-alumnos',
  templateUrl: './index-alumnos.component.html',
  styleUrls: ['./index-alumnos.component.css']
})

export class IndexAlumnosComponent implements OnInit{

  strings: any; // Variable para almacenar los textos
  noHayEncuestasDisponibles: boolean = true;


  constructor(
    private authService: AuthService, // Servicio de autenticación
    private languageService: LanguageService, // Servicio de idioma
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private popupfactoryService: PopupfactoryService
  ) {}

  ngOnInit() {
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

    this.obtenerCampanas();

    // Verifica si se debe mostrar el diálogo de encuesta bierta satisfactoriamente
    const encuestaInactiva = localStorage.getItem('encuestaInactiva');
    if (encuestaInactiva === 'true') {
      // Limpia el indicador almacenado después de mostrar el diálogo
      localStorage.removeItem('encuestaInactiva');
      this.mostrarDialogo('inactiva');
    } 

  }

  obtenerCampanas(){
    this.authService.getCampanas().subscribe((res: any) => {

      //limpiar el contenedor de componentes
      this.viewContainerRef.clear();

      // Crear un componente campana-abierta por cada campaña
      res.forEach((campana: any) => {
      let factory;
      let componentRef;
      let instance;
      this.noHayEncuestasDisponibles=false;


      if (campana.veces_activada >= 1) {
        factory = this.resolver.resolveComponentFactory(CampanaAbiertaComponent);
        componentRef = this.viewContainerRef.createComponent(factory);
        instance = componentRef.instance as CampanaAbiertaComponent;
      } else {
        factory = this.resolver.resolveComponentFactory(CampanaCerradaComponent);
        componentRef = this.viewContainerRef.createComponent(factory);
        instance = componentRef.instance as CampanaCerradaComponent;
      }

      // Setear los atributos de cada campaña
      instance.nombreAsignatura = campana.nombre_asignatura;
      instance.profesor = campana.nombre_docente;
      instance.cod_campana = campana.cod_campana;
      instance.nombre_campana = campana.nombre_campana;
      instance.fecha_fin = new Date(campana.fecha_fin);
      instance.veces_activada = campana.veces_abierta;
      instance.cod_encuesta = campana.cod_encuesta;
      instance.cod_situacion_docente = campana.cod_situacion_docente;
      instance.cod_asignatura = campana.cod_asignatura;
      instance.nombre_asignatura = campana.nombre_asignatura;
      instance.cod_docente = campana.cod_docente;
      instance.nombre_docente = campana.nombre_docente;
      instance.num_curso = campana.num_curso;
      instance.anno_curso = campana.año_curso;
      instance.fecha_fin_activacion = new Date(campana.fecha_fin_activacion);

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

mostrarDialogo(tipo:string){
  setTimeout(() => {
    if (tipo == 'inactiva'){
      this.popupfactoryService.openOkPoup(this.strings["popup.inactiva.head"], this.strings["popup.inactiva.body"]);
    }
  }, 1500); 
}

}
