import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from '../../../services/languaje.service';
import { Router } from '@angular/router';
import { CampanaAdminComponent } from '../../shared/campañas/campana-admin/campana-admin.component';
import { CampanaAdminAbiertaComponent } from '../../shared/campañas/campana-admin-abierta/campana-admin-abierta.component';
import { SelectedEncuestasService } from '../../../services/selected-encuestas-service.service';
import { PopupfactoryService } from '../../../services/popupfactory.service'


@Component({
  selector: 'app-listado-encuestas-admin',
  templateUrl: './listado-encuestas-admin.component.html',
  styleUrls: ['./listado-encuestas-admin.component.css']
})
export class ListadoEncuestasAdminComponent implements OnInit {
  strings: any; // Variable para almacenar los textos
  noHayCampanasValidas: boolean = true;
  porcentajeResp: string[] = ['0%', '<10%', '<20%', '<30%', '<40%', '<50%', '<60%', '<70%', '<80%', '<90%'];
  selectedPorcentaje: any;
  selectedAnno: any;
  annosCampannas: any;
  mostrarBotonSelect : boolean = false;
  mensajeEmail : String = "";

  // ---- atributos para la paginacion ----
  totalCampanas!: number;
  campanasPorPagina: number = 5;
  paginas: number[] = [];
  paginaActual: number = 1;
  campanasPagina: any[] = [];

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private languageService: LanguageService, // Servicio de idioma
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    public selectedEncuestasService: SelectedEncuestasService,
    private popupfactoryService: PopupfactoryService
  ) {}

  ngOnInit() {
    const lang = 'es'; // Idioma predeterminado
    this.languageService.currentLanguage$.subscribe((lang) => {
      // Suscripción a cambios en el idioma actual
      this.languageService.loadStrings(lang).subscribe(
        // Carga los strings correspondientes al idioma actual
        (data) => {
          this.strings = data; // Almacena los textos cargados en la variable 'strings'
          this.getAnnosCampañas()
          this.getCampannasAdmin();
        },
        (error) => {
          console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
        }
      );
    });
  }

  getCampannasAdmin() {
    this.authService.getCampanasAdmin().subscribe((res: any) => {
      // Obtener el número total de campañas
      this.totalCampanas = res.length;

      // Calcular el número de páginas
      const totalPages = Math.ceil(this.totalCampanas / this.campanasPorPagina);
      this.paginas = Array(totalPages)
        .fill(0)
        .map((x, i) => i + 1);

      // Restablecer la página actual si es mayor al número de páginas
      if (this.paginaActual > totalPages) {
        this.paginaActual = totalPages;
      }

      // Restablecer la variable 'noHayCampanasValidas'
      this.noHayCampanasValidas = this.totalCampanas === 0;

      // Limpiar el contenedor de componentes
      this.viewContainerRef.clear();

      // Obtener el subconjunto de campañas para la página actual
      const startIndex = (this.paginaActual - 1) * this.campanasPorPagina;
      const endIndex = startIndex + this.campanasPorPagina;
      this.campanasPagina = res.slice(startIndex, endIndex);

      // Crear un componente campana-abierta por cada campaña
      this.campanasPagina.forEach((campana: any) => {
        let factory;
        let componentRef;
        let instance;
        this.noHayCampanasValidas = false;

        // generar un tipo de componente distinto para campaña con encuesta abierta o no
        if (campana.fecha_hora_cierre !== null) {
          // Crear el componente campaña abierta
          factory = this.resolver.resolveComponentFactory(CampanaAdminAbiertaComponent);
          componentRef = this.viewContainerRef.createComponent(factory);
          instance = componentRef.instance as CampanaAdminAbiertaComponent;
        } else {
          // Crear el componente campaña cerrada
          factory = this.resolver.resolveComponentFactory(CampanaAdminComponent);
          componentRef = this.viewContainerRef.createComponent(factory);
          instance = componentRef.instance as CampanaAdminComponent;
        }

        // Verificar si hay situaciones docentes agrupadas
        if (campana.agrupado_con && campana.agrupado_con.length > 0) {
          // Si hay sds agrupadas...
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
        const encuestasContainer = document.querySelector('.encuestas');
        if (encuestasContainer) {
          const childElement = componentRef.location.nativeElement;
          encuestasContainer.appendChild(childElement);
        }
      });
    });
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.getCampannasAdmin();
    this.selectedEncuestasService.vaciarEncuestas();
  }

  isPaginaActual(pagina: number): boolean {
    return pagina === this.paginaActual;
  }

  activarEncuestasSeleccionadas() {
    
    const encuestasSeleccionadas = this.selectedEncuestasService.obtenerEncuestas();
    if (encuestasSeleccionadas.length > 0) {
      this.popupfactoryService.openFechaHoraPopup(this.strings["popup.activacion.head"], this.strings["popup.activacion.body"])
      .then((selectedDateTime: string) => {

        this.popupfactoryService.openMensajePopup().then((res: any) => {
          if(res){ // si el segundo modal devuelve true:
            this.mensajeEmail=res;
            for (let index = 0; index < encuestasSeleccionadas.length; index++) {
              const element = encuestasSeleccionadas[index];
              element.activarConMensaje(this.mensajeEmail, selectedDateTime)
            }
          }
        
        });
      });
    }
    
  }

  getAnnosCampañas() {
    this.authService.getAnnosCampañas().subscribe((res: any) => {
      this.annosCampannas = [this.strings["todos.años"], ...res];
    });
  }

  selectPorcentaje(porcentaje: any) {
    this.selectedPorcentaje = porcentaje;
  }

  selectAnno(anno: any) {
    this.selectedAnno = anno;
    this.mostrarBotonSelect = true;
  }
  

}
