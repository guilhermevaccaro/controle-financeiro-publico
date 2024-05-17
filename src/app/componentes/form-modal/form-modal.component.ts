import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pedido } from 'src/app/models/Pedido';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
})
export class FormModalComponent {
  @Input() dados: Pedido | undefined;
  @Output() clickClose = new EventEmitter<void>();

  onCancel() {
    this.clickClose.emit();
  }
}
