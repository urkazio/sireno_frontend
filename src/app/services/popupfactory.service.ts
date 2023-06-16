import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupRolesComponent } from '../components/shared/popups/popup-roles-do-al/popup-roles-do-al.component';
import { PopupRolesDoAdComponent } from '../components/shared/popups/popup-roles-do-ad/popup-roles-do-ad.component';
import { PopupRolesDoAlAdComponent } from '../components/shared/popups/popup-roles-do-al-ad/popup-roles-do-al-ad.component';
import { PopupOkComponent } from '../components/shared/popups/popup-ok/popup-ok.component';



@Injectable({
  providedIn: 'root'
})
export class PopupfactoryService {

  constructor(private modalService: NgbModal) { }

  // llama al popup agregando una promesa para esperar a que el modal se cierre y devolver el valor de la opción seleccionada
  openPopupRoles_do_al(): Promise<string> {
    const modalRef = this.modalService.open(PopupRolesComponent);
    return modalRef.result.then((selectedOption: string) => {
      return selectedOption;
    }).catch(() => {
      return ''; // Manejo del caso en que se cierre el modal sin seleccionar una opción
    });
  }

  // llama al popup agregando una promesa para esperar a que el modal se cierre y devolver el valor de la opción seleccionada
  openPopupRoles_do_ad(): Promise<string> {
    const modalRef = this.modalService.open(PopupRolesDoAdComponent);
    return modalRef.result.then((selectedOption: string) => {
      return selectedOption;
    }).catch(() => {
      return ''; // Manejo del caso en que se cierre el modal sin seleccionar una opción
    });
  }

    // llama al popup agregando una promesa para esperar a que el modal se cierre y devolver el valor de la opción seleccionada
    openPopupRoles_do_al_ad(): Promise<string> {
      const modalRef = this.modalService.open(PopupRolesDoAlAdComponent);
      return modalRef.result.then((selectedOption: string) => {
        return selectedOption;
      }).catch(() => {
        return ''; // Manejo del caso en que se cierre el modal sin seleccionar una opción
      });
    }

  // abre el popup 'de okay' con valores custom 
  openOkPoup(title: string, mensaje: string): Promise<boolean> {
    const modalRef = this.modalService.open(PopupOkComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.mensaje = mensaje;

    //devuelve true si ha pulsado el boton aceptar
    return new Promise<boolean>((resolve) => {
      const acceptButton = document.querySelector('.modal-footer button.btn-primary');
      acceptButton?.addEventListener('click', () => {
        resolve(true);
      });
    });
  }
  

}
