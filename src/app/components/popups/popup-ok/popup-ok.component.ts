import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-popup-ok',
  templateUrl: './popup-ok.component.html',
  styleUrls: ['./popup-ok.component.css']
})
export class PopupOkComponent {
  @Input() title: string = '';;
  @Input() mensaje: string = '';;

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss();
  }

}
