import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Pedido } from 'src/app/models/Pedido';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
})
export class FormModalComponent implements OnInit, OnChanges {
  @Input() pedido!: Pedido;
  @Output() clickClose = new EventEmitter<void>();

  ngOnInit() {
    console.log(this.pedido);
  }
  ngOnChanges() {
    console.log(this.pedido);
  }
  click() {
    console.log(this.pedido);
  }
  onCancel() {
    this.clickClose.emit();
  }
}
