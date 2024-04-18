import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent {
  dados!: Transacao[];
  form!: FormGroup;
  saldoMes = 0;
  saldoPrevisto = 0;
  saldoPendente = 0;
  somaDespesa = 0;
  somaReceita = 0;
  valorSelecionado!: any;

  constructor(
    private formBuilder: FormBuilder,
    private serviceContato: ContatoService
  ) {
    this.form = this.formBuilder.group({
      mes: [new Date()],
    });
    this.valorSelecionado = new Date().getMonth() + 1;
  }

  ngOnInit(): void {
    this.calculaSaldos();
  }

  customInputStyle = {
    cursor: 'pointer',
    'text-align': 'center',
    'border-radius': '25px',
  };

  onDateSelect(event: any) {
    const selectedDate: Date = event;
    this.valorSelecionado = selectedDate.getMonth() + 1;
    this.calculaSaldos();
  }

  calculaSaldos() {
    this.serviceContato.getCollection('transacoes').subscribe((items) => {
      const dataFiltradaPendente = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return mes === parseInt(this.valorSelecionado);
      });
      this.dados = dataFiltradaPendente;

      const dadosEfetivados = dataFiltradaPendente.filter(
        (item) => item.situacao === true
      );

      this.somaReceita = this.dados
        .filter((item) => item.tipo === 'receita')
        .map((item) => item.valor)
        .reduce((total, valor) => total + valor, 0);

      this.somaDespesa = this.dados
        .filter((item) => item.tipo === 'despesa')
        .map((item) => item.valor)
        .reduce((total, valor) => total + valor, 0);

      this.saldoPrevisto = this.somaReceita - this.somaDespesa;

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
