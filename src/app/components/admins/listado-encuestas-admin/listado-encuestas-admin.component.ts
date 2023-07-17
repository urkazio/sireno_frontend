import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from '../../../services/languaje.service';
import { Router } from '@angular/router';
import { CampanaAdminComponent } from '../../shared/campañas/campana-admin/campana-admin.component';
import { CampanaAdminAbiertaComponent } from '../../shared/campañas/campana-admin-abierta/campana-admin-abierta.component';
import { SelectedEncuestasService } from '../../../services/selected-encuestas-service.service';
import {ListadoEncuestasService} from '../../../services/listado-encuestas-service.service';
import { PopupfactoryService } from '../../../services/popupfactory.service';


@Component({
  selector: 'app-listado-encuestas-admin',
  templateUrl: './listado-encuestas-admin.component.html',
  styleUrls: ['./listado-encuestas-admin.component.css']
})

export class ListadoEncuestasAdminComponent implements OnInit {
  strings: any; // Variable para almacenar los textos
  noHayCampanasValidas: boolean = false;
  noHayCampanasCargadas: boolean = true;
  porcentajeResp: string[] = ['0%', '<10%', '<20%', '<30%', '<40%', '<50%', '<60%', '<70%', '<80%', '<90%', '<=100%'];
  selectedPorcentaje: any;
  selectedAnno: any;
  annosCampannas: any;
  mensajeEmail: String = "";

  // ---- atributos para la paginacion ----
  totalCampanas!: number;
  campanasPorPagina: number = 5;
  paginas: number[] = [];
  paginaActual: number = 1;
  campanasPagina: any[] = [];
  maxPaginasMostradas: number = 5; // Número máximo de páginas mostradas sin usar el desplegable
  paginasRestantes: number[] = []; // Páginas restantes a mostrar en el desplegable
  mostrarDesplegable: boolean = false; // Indicador de si se debe mostrar el desplegable

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private languageService: LanguageService, // Servicio de idioma
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    public selectedEncuestasService: SelectedEncuestasService,
    private popupfactoryService: PopupfactoryService,
    private listadoEncuestasService: ListadoEncuestasService
  ) {}

  ngOnInit() {
    const lang = 'es'; // Idioma predeterminado
    this.languageService.currentLanguage$.subscribe((lang) => {
      // Suscripción a cambios en el idioma actual
      this.languageService.loadStrings(lang).subscribe(
        // Carga los strings correspondientes al idioma actual
        (data) => {
          this.strings = data; // Almacena los textos cargados en la variable 'strings'
          this.getAnnosCampañas();
        },
        (error) => {
          console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
        }
      );
    });

    this.listadoEncuestasService.mostrarEncuestasFiltros$.subscribe(() => {
      this.mostrarEncuestasFiltros();
    });
  }

  getCampannasAdmin(año_curso:string, ratio_respuestas:any) {

    this.authService.getCampanasAdmin(año_curso,ratio_respuestas).subscribe((res: any) => {

      console.log(res)

      // Obtener el número total de campañas
      this.totalCampanas = res.length;

      if (res.length==0){
        this.noHayCampanasValidas = true;
        //limpiar el container de paginacion
        const paginationContainer = document.querySelector('.pagination-container ');
        if (paginationContainer) {
          paginationContainer.innerHTML = '';
        }
      }else{
        this.noHayCampanasValidas = false;

        // Calcular el número de páginas
        const totalPages = Math.ceil(this.totalCampanas / this.campanasPorPagina);
        this.paginas = Array(totalPages)
          .fill(0)
          .map((x, i) => i + 1);

        // Restablecer la página actual si es mayor al número de páginas
        if (this.paginaActual > totalPages) {
          this.paginaActual = totalPages;
        }

        // Verificar si hay más de cinco páginas
        if (this.paginas.length > this.maxPaginasMostradas) {
          this.paginasRestantes = this.paginas.slice(this.maxPaginasMostradas);
          this.paginas = this.paginas.slice(0, this.maxPaginasMostradas);
          this.mostrarDesplegable = true;
        } else {
          this.mostrarDesplegable = false;
        }

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
      }
    });
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.mostrarEncuestasFiltros();
    this.selectedEncuestasService.vaciarEncuestas();
  }

  isPaginaActual(pagina: number): boolean {
    return pagina === this.paginaActual;
  }

  activarEncuestasSeleccionadas() {
    const encuestasSeleccionadas = this.selectedEncuestasService.obtenerEncuestas();
    if (encuestasSeleccionadas.length > 0) {
      var num_enc = encuestasSeleccionadas.length.toString();
      this.popupfactoryService.openFechaHoraPopup(this.strings["popup.activaciones.head1"]+num_enc+this.strings["popup.activaciones.head2"], this.strings["popup.activacion.body"])
      .then((selectedDateTime: string) => {
        this.popupfactoryService.openMensajePopup().then((res: any) => {
          if (res) { // si el segundo modal devuelve true:
            this.mensajeEmail = res;
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
      this.annosCampannas = ["todos.años", ...res];
    });
  }

  selectPorcentaje(porcentaje: any) {
    this.selectedPorcentaje = porcentaje;
  }

  selectAnno(anno: any) {
    this.selectedAnno = anno;
  }

  getAnnoLabel(anno: any): string {
    if (anno){
      return anno === 'todos.años' ? this.strings['todos.años'] : anno;
    }else{
      return this.strings['año.del.curso']
    }
  }

  mostrarEncuestasFiltros() {
    this.noHayCampanasCargadas = false;
    this.noHayCampanasValidas = false;
    const ratio_respuestas = this.getRatioRespuestas();
    const año_curso = this.getAñoCurso();
  
    if (typeof año_curso !== 'undefined' && typeof ratio_respuestas !== 'undefined') {
      // Limpiar los divs antes de mostrar las encuestas
      const noHayCampanasValidasDiv = document.querySelector('.mensaje.no-hay-campanas-validas');
      const noHayCampanasCargadasDiv = document.querySelector('.mensaje.no-hay-campanas-cargadas');
      const encuestasContainer = document.querySelector('.encuestas');
      
      if (noHayCampanasValidasDiv) {
        noHayCampanasValidasDiv.innerHTML = '';
      }
      if (noHayCampanasCargadasDiv) {
        noHayCampanasCargadasDiv.innerHTML = '';
      }
      if (encuestasContainer) {
        encuestasContainer.innerHTML = '';
      }
      
      this.getCampannasAdmin(año_curso, ratio_respuestas);
      this.checkDialogo();
    }
  }
  
  private getRatioRespuestas(): number | undefined {
    switch (this.selectedPorcentaje) {
      case '0%':
        return 0;
      case '<10%':
        return 0.1;
      case '<20%':
        return 0.2;
      case '<30%':
        return 0.3;
      case '<40%':
        return 0.4;
      case '<50%':
        return 0.5;
      case '<60%':
        return 0.6;
      case '<70%':
        return 0.7;
      case '<80%':
        return 0.8;
      case '<90%':
        return 0.9;
      case '<=100%':
        return 1;
      default:
        return undefined;
    }
  }
  
  private getAñoCurso(): string | '*' | undefined {
    switch (this.selectedAnno) {
      case 'todos.años':
        return '*';
      default:
        return this.selectedAnno;
    }
  }

  checkDialogo(){
    // Verifica si se debe mostrar el diálogo de encuesta bierta satisfactoriamente
    const mostrarDialogoAbierta = localStorage.getItem('encuestaAbiertaOK');
    if (mostrarDialogoAbierta === 'true') {
      // Limpia el indicador almacenado después de mostrar el diálogo
      localStorage.removeItem('encuestaAbiertaOK');
      this.mostrarDialogo('abierta');
      this.paginaActual=1;
    }  

    // Verifica si se debe mostrar el diálogo de encuesta bierta satisfactoriamente
    const mostrarDialogoCerrada = localStorage.getItem('encuestaCerradaOK');
    if (mostrarDialogoCerrada === 'true') {
      // Limpia el indicador almacenado después de mostrar el diálogo
      localStorage.removeItem('encuestaCerradaOK');
      this.mostrarDialogo('cerrada');
    }  
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
