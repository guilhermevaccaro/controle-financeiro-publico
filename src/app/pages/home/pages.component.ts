import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent {
  dados!: Transacao[];
  dadosDespesa!: Transacao[];
  dadosReceita!: Transacao[];
  form!: FormGroup;
  saldoMes = 0;
  saldoPrevisto = 0;
  saldoPendente = 0;
  somaDespesa = 0;
  somaReceita = 0;
  valorSelecionado!: any;
  rangeDates: Date[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private serviceContato: ContatoService
  ) {
    const dataInicio = new Date();
    dataInicio.setDate(1);

    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + 1);
    dataFim.setDate(0);

    this.form = this.formBuilder.group({
      rangeDates: [[dataInicio, dataFim]],
    });
    this.valorSelecionado = new Date().getMonth() + 1;
  }

  ngOnInit(): void {
    this.carregar();
  }

  customInputStyle = {
    cursor: 'pointer',
    'text-align': 'center',
    'border-radius': '25px',
  };

  onDateSelect(event: any) {
    const selectedDate: Date = event;
    this.valorSelecionado = selectedDate.getMonth() + 1;
    this.carregar();
  }

  carregar() {
    this.serviceContato
      .getTransacoesPorIntervaloDeDatas(
        this.form.value.rangeDates[0],
        this.form.value.rangeDates[1]
      )
      .subscribe((transacoes) => {
        this.dados = transacoes;

        this.dadosReceita = [];
        this.dadosDespesa = [];

        this.dados.forEach((transacao) => {
          if (transacao.tipo === 'receita') {
            this.dadosReceita.push(transacao);
          } else {
            this.dadosDespesa.push(transacao);
          }
        });

          let somaReceitas = 0;
          let somaDespesas = 0;
          let somaReceitasEfetivadas = 0;
          let somaReceitasPendentes = 0;
          let somaDespesasEfetivadas = 0;
          let somaDespesasPendentes = 0;

        // Itera sobre os documentos e atualiza as somas de acordo com o tipo da transação
        transacoes.forEach((transacao) => {
          const valorTotal = transacao.valorTotal;
          if (transacao.tipo === 'receita') {
            somaReceitas += valorTotal;
            if (transacao.situacao.nome === 'Efetivado') {
              somaReceitasEfetivadas += valorTotal;
            } else {
              somaReceitasPendentes += valorTotal;
            }
          } else if (transacao.tipo === 'despesa') {
            somaDespesas -= valorTotal;
            if (transacao.situacao.nome === 'Efetivado') {
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
