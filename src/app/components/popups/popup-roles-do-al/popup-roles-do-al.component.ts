import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-roles',
  templateUrl: './popup-roles-do-al.component.html',
  styleUrls: ['./popup-roles-do-al.component.css']
})
export class PopupRolesComponent {
  selectedOption: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss('');
  }
  
  onSaveChanges() {
    this.activeModal.close(this.selectedOption);
  }
}