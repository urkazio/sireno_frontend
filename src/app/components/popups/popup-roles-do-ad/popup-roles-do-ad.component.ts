import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-roles-do-ad',
  templateUrl: './popup-roles-do-ad.component.html',
  styleUrls: ['./popup-roles-do-ad.component.css']
})
export class PopupRolesDoAdComponent {
  selectedOption: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss('');
  }
  
  onSaveChanges() {
    this.activeModal.close(this.selectedOption);
  }
}