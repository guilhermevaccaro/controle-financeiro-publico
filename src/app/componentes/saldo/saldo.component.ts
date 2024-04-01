import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css'],
})
export class SaldoComponent {
  saldoPrevisto = 0;
  saldoPendente = 0;
  saldoMes = 0;
  @Input() mes!: string;
  dados!: Transacao[];
  dadosReceita!: Transacao[];
  dadosDespesa!: Transacao[];
  somaReceita = 0;
  somaDespesa = 0;

  constructor(private serviceContato: ContatoService) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('mes' in changes) {
      this.calculaSaldos();
    }
  }

  calculaSaldos() {
    this.serviceContato.getCollection('transacoes').subscribe((items) => {
      const dataFiltradaPendente = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return mes === parseInt(this.mes);
      });
      this.dados = dataFiltradaPendente;

      this.saldoPrevisto =
        this.dados
          .filter((item) => item.tipo === 'receita')
          .map((item) => item.valor)
          .reduce((total, valor) => total + valor, 0) -
        this.dados
          .filter((item) => item.tipo === 'despesa')
          .map((item) => item.valor)
          .reduce((total, valor) => total + valor, 0);

      const dadosEfetivados = dataFiltradaPendente.filter(
        (item) => item.situacao === true
      );

      this.saldoMes =
        dadosEfetivados
          .filter((item) => item.tipo === 'receita')
          .map((item) => item.valor)
          .reduce((total, valor) => total + valor, 0) -
        dadosEfetivados
          .filter((item) => item.tipo === 'despesa')
          .map((item) => item.valor)
          .reduce((total, valor) => total + valor, 0);

      const dadosPendentes = dataFiltradaPendente.filter(
        (item) => item.situacao !== true
      );

      this.saldoPendente =
        dadosPendentes
          .filter((item) => item.tipo === 'receita')
          .map((item) => item.valor)
          .reduce((total, valor) => total + valor, 0) -
        dadosPendentes
          .filter((item) => item.tipo === 'despesa')
          .map((item) => item.valor)
          .reduce((total, valor) => total + valor, 0);
    });
  }
}
