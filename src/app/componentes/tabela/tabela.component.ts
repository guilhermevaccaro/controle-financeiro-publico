import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent {
  @Input() contatos!: Transacao[];
  @Input() tipoTransacao: string = '';

  @Output() edit = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  @Output() addDespesa = new EventEmitter<{ evento: any; tipo: string }>();
  @Output() addReceita = new EventEmitter<{ evento: any; tipo: string }>();

  constructor(private transacaoService: ContatoService) {}

  adicionarTransacao(tipo: string) {
    if (tipo === 'despesa') {
      this.addDespesa.emit({ evento: true, tipo: tipo });
    } else if (tipo === 'receita') {
      this.addReceita.emit({ evento: true, tipo: tipo });
    }
  }
  editandoTransacao(transacao: Transacao) {
    console.log(transacao)
    this.edit.emit(transacao);
  }
  deletandoTransacao(key: Transacao) {
    this.remove.emit(key);
  }
}
