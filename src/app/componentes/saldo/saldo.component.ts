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
      this.calculaSaldoPrevisto();
      this.calculaSaldo();
    }
  }

  calculaSaldoPrevisto() {
    this.serviceContato.getAll().subscribe((items) => {
      const dataFiltrada = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return mes === parseInt(this.mes);
      });
      this.dados = dataFiltrada;

      this.dadosReceita = this.dados.filter((item) => item.tipo === 'receita');
      const valorReceita = this.dadosReceita.map((item) => item.valor);
      this.somaReceita = valorReceita.reduce(
        (total, valor) => total + valor,
        0
      );

      this.dadosDespesa = this.dados.filter((item) => item.tipo === 'despesa');
      const valorDespesa = this.dadosDespesa.map((item) => item.valor);
      this.somaDespesa = valorDespesa.reduce(
        (total, valor) => total + valor,
        0
      );
      this.saldoPrevisto = this.somaReceita - this.somaDespesa;
    });
  }

  calculaSaldo() {
    this.serviceContato.getAll().subscribe((items) => {
      const dadosEfetivados = items.filter(
        (item) => item.situacao === 'Efetivado'
      );

      const dataFiltrada = dadosEfetivados.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return mes === parseInt(this.mes);
      });

      this.dados = dataFiltrada;

      this.dadosReceita = this.dados.filter((item) => item.tipo === 'receita');
      const valorReceita = this.dadosReceita.map((item) => item.valor);
      this.somaReceita = valorReceita.reduce(
        (total, valor) => total + valor,
        0
      );

      this.dadosDespesa = this.dados.filter((item) => item.tipo === 'despesa');
      const valorDespesa = this.dadosDespesa.map((item) => item.valor);
      this.somaDespesa = valorDespesa.reduce(
        (total, valor) => total + valor,
        0
      );

      this.saldoMes = this.somaReceita - this.somaDespesa;
    });
  }
}
