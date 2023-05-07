import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit{
  @Output() closePopup: EventEmitter<any> = new EventEmitter();

  isOpen: boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

  open(): void {
    console.log("popup");
    const popupElement = document.getElementById('popupContainer');
    if (popupElement) {
      popupElement.classList.add('show');
    }
  }

  onClosePopup(): void {
    this.isOpen = false;
    this.closePopup.emit();
  }
}