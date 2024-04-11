import { Component, EventEmitter, Output } from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';

@Component({
  selector: 'app-botaoAdd',
  templateUrl: './botaoAdd.component.html',
  styleUrls: ['./botaoAdd.component.css'],
})
export class BotaoAddComponent {
  @Output() open = new EventEmitter(false);
  @Output() openAdd = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);

  abrindoModal(tipo: string, transacao?: Transacao) {
    if (transacao) {
      this.open.emit(transacao);
    } else {
      this.openAdd.emit(tipo);
    }
  }
}
