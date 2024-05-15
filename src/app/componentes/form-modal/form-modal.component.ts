/* eslint-disable no-prototype-builtins */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
})
export class FormModalComponent {
  @Input() dados!: any;
  @Output() clickClose = new EventEmitter<void>();

  pecas!: any;

  onCancel() {
    this.clickClose.emit();
  }
}
