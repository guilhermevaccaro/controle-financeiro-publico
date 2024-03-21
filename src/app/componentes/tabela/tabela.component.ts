import { Component, EventEmitter, Input, Output } from '@angular/core';
import { transacoes } from 'src/app/models/transacoes';
import { TransacoesModel } from 'src/app/models/TransacoesModel';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent {
  displayedColumns = [
    'situacao',
    'categoria',
    // 'descricao',
    // 'tipo',
    'valor',
    'data',
    'acoes',
  ];
  @Input() dados!: TransacoesModel[];
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
  editandoTransacao(transacao: transacoes) {
    this.edit.emit(transacao);
  }
  deletandoTransacao(transacao: transacoes) {
    this.remove.emit(transacao);
    location.reload();
  }
}
