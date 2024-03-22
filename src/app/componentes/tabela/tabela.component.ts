import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';


@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent {

  @Input() contatos!: Transacao[];
  @Input() tipoTransacao: string = ''; // Propriedade de entrada para receber o tipo de transação do componente pai

  @Output() edit = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  @Output() addDespesa = new EventEmitter<{ evento: any; tipo: string }>();
  @Output() addReceita = new EventEmitter<{ evento: any; tipo: string }>();

  adicionarTransacao(tipo: string) {
    if (tipo === 'despesa') {
      this.addDespesa.emit({ evento: true, tipo: tipo });
    } else if (tipo === 'receita') {
      this.addReceita.emit({ evento: true, tipo: tipo });
    }
  }
  editandoTransacao(transacao: Transacao) {
    this.edit.emit(transacao);
  }
  deletandoTransacao(key: Transacao) {
    this.remove.emit(key);
  }
}
