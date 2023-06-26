import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { LanguageService } from '../../../services/languaje.service';
import { AuthService } from 'src/app/services/auth.service';
import { CampanaDocenteComponent } from '../../shared/campañas/campana-docente/campana-docente.component';
import { CampanaDocenteAbiertaComponent } from '../../shared/campañas/campana-docente-abierta/campana-docente-abierta.component';
import { PopupfactoryService } from 'src/app/services/popupfactory.service';


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
    private popupfactoryService: PopupfactoryService

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

    // Verifica si se debe mostrar el diálogo de encuesta bierta satisfactoriamente
    const mostrarDialogoAbierta = localStorage.getItem('encuestaAbiertaOK');
    if (mostrarDialogoAbierta === 'true') {
      // Limpia el indicador almacenado después de mostrar el diálogo
      localStorage.removeItem('encuestaAbiertaOK');
      this.mostrarDialogo('abierta');
    }  

    // Verifica si se debe mostrar el diálogo de encuesta bierta satisfactoriamente
    const mostrarDialogoCerrada = localStorage.getItem('encuestaCerradaOK');
    if (mostrarDialogoCerrada === 'true') {
      // Limpia el indicador almacenado después de mostrar el diálogo
      localStorage.removeItem('encuestaCerradaOK');
      this.mostrarDialogo('cerrada');
    }  
  }

  getCampannasDocente() {
    this.authService.getCampannasDocente().subscribe((res: any) => {
      // Limpiar el contenedor de componentes
      this.viewContainerRef.clear();
  
      // Crear un componente campana-abierta por cada campaña
      res.forEach((campana: any) => {
        let factory;
        let componentRef;
        let instance;
        this.noHayCampanasValidas = false;
   
        // generar un tipo de componente distinto para campaña con encuesta abierta o no
        if (campana.fecha_hora_cierre !== null) {
          // Crear el componente CampanaDocenteActivadaComponent
          factory = this.resolver.resolveComponentFactory(CampanaDocenteAbiertaComponent);
          componentRef = this.viewContainerRef.createComponent(factory);
          instance = componentRef.instance as CampanaDocenteAbiertaComponent;
        } else {
          // Crear el componente CampanaDocenteComponent
          factory = this.resolver.resolveComponentFactory(CampanaDocenteComponent);
          componentRef = this.viewContainerRef.createComponent(factory);
          instance = componentRef.instance as CampanaDocenteComponent;
        }
  
        // Verificar si hay situaciones docentes agrupadas
        if (campana.agrupado_con && campana.agrupado_con.length > 0) { // Si hay sds agrupadas...
          // Calcular la suma de n_alum_total y n_alum_respondido
          let nAlumTotalSum = campana.n_alum_total;
          let nAlumRespondidoSum = campana.n_alum_respondido;
          campana.agrupado_con.forEach((agrupado: any) => {
            nAlumTotalSum += agrupado.n_alum_total;
            nAlumRespondidoSum += agrupado.n_alum_respondido;
          });
  
          instance.cod_situacion_docente = campana.cod_situacion_docente;
          instance.n_alum_total = nAlumTotalSum;
          instance.n_alum_respondido = nAlumRespondidoSum;
          
        } else {
          instance.cod_situacion_docente = campana.cod_situacion_docente;
          instance.n_alum_total = campana.n_alum_total;
          instance.n_alum_respondido = campana.n_alum_respondido;
        }
  
        instance.nombre_Asignatura = campana.nombre_Asignatura;
        instance.fecha_fin = new Date(campana.fecha_fin);
        instance.num_curso = campana.num_curso;
        instance.anno_curso = campana.año_curso;
        instance.veces_abierta = campana.activada;
        instance.agrupado_con = campana.agrupado_con;
        instance.fecha_hora_cierre = new Date(campana.fecha_hora_cierre);
  
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
      if (tipo == 'abierta'){
        this.popupfactoryService.openOkPoup(this.strings["popup.activacionOK.head"], this.strings["popup.activacionOK.body"]);
      }else if(tipo == 'cerrada'){
        this.popupfactoryService.openOkPoup(this.strings["popup.cerradaOK.head"], this.strings["popup.cerradaOK.body"]);
      }
    }, 500); 
  }

  
}  
