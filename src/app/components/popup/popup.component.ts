import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
}) 
export class PopupComponent implements OnInit {
  @Output() closePopup: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClosePopup(): void {
    this.closePopup.emit();
  }
}
