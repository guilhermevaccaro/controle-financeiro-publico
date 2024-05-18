import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pedido } from 'src/app/models/Pedido';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit {
  dados!: Pedido[];
  dadosDespesa!: Pedido[];
  dadosReceita!: Pedido[];
  form!: FormGroup;
  saldoMes = 0;
  saldoPrevisto = 0;
  saldoPendente = 0;
  somaDespesa = 0;
  somaReceita = 0;
  rangeDates: Date[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private serviceContato: ContatoService
  ) {
    const dataInicio = new Date();
    dataInicio.setDate(1);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + 1);
    dataFim.setDate(0);
    dataFim.setHours(23, 59, 59, 999);
    this.form = this.formBuilder.group({
      rangeDates: [[dataInicio, dataFim]],
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  customInputStyle = {
    cursor: 'pointer',
    'text-align': 'center',
    'border-radius': '25px',
  };

  onDateSelect() {
    this.carregar();
  }

  carregar() {
    const [inicio, fim] = this.form.value.rangeDates.map(
      (date: string) => new Date(date)
    );
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);

    const startDate = inicio;
    const endDate = fim;
    this.serviceContato
      .getTransacoesPorIntervaloDeDatas(startDate, endDate)
      .subscribe((transacoes) => {
        this.dados = transacoes;

        this.dadosReceita = [];
        this.dadosDespesa = [];

        this.dados.forEach((Pedido) => {
          if (Pedido.tipo === 'receita') {
            this.dadosReceita.push(Pedido);
          } else {
            this.dadosDespesa.push(Pedido);
          }
        });

        let somaReceitas = 0;
        let somaDespesas = 0;
        let somaReceitasEfetivadas = 0;
        let somaReceitasPendentes = 0;
        let somaDespesasEfetivadas = 0;
        let somaDespesasPendentes = 0;

        // Itera sobre os documentos e atualiza as somas de acordo com o tipo da transação
        transacoes.forEach((Pedido) => {
          const valorTotal = Pedido.valorTotal;
          if (Pedido.tipo === 'receita') {
            somaReceitas += valorTotal;
            if (Pedido.situacao.nome === 'Efetivado') {
              somaReceitasEfetivadas += valorTotal;
            } else {
              somaReceitasPendentes += valorTotal;
            }
          } else if (Pedido.tipo === 'despesa') {
            somaDespesas -= valorTotal;
            if (Pedido.situacao.nome === 'Efetivado') {
              somaDespesasEfetivadas -= valorTotal;
            } else {
              somaDespesasPendentes += valorTotal;
            }
          }
        });

        this.saldoMes = somaReceitas + somaDespesas;
        this.somaReceita = somaReceitas;
        this.somaDespesa = somaDespesas;
      });
  }
}
