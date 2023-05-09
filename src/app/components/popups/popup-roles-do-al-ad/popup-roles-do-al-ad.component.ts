import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-roles-do-al-ad',
  templateUrl: './popup-roles-do-al-ad.component.html',
  styleUrls: ['./popup-roles-do-al-ad.component.css']
})
export class PopupRolesDoAlAdComponent {
  selectedOption: string = '';;

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss('');
  }
  
  onSaveChanges() {
    this.activeModal.close(this.selectedOption);
  }
}
