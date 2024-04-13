import { Component, Input, SimpleChanges } from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';

@Component({
  selector: 'app-transacoes-lista',
  templateUrl: './transacoes-lista.component.html',
  styleUrls: ['./transacoes-lista.component.css'],
})
export class TransacoesListaComponent {
  contatos!: Transacao[];
  @Input() valorSelecionado!: string;
  @Input() filtro!: string;
  @Input() somaReceita!: number;
  @Input() somaDespesa!: number;
  @Input() saldoPrevisto!: number;
  @Input() dados1!: any;
  data: any;
  data2: any;
  options: any;
  dados = true;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('valorSelecionado' in changes) {
    }
    if (changes['dados1'] && changes['dados1'].currentValue) {
      this.processarDados(this.dados1);
    }
  }

  private processarDados(dados: Transacao[]): void {
    console.log('Dados recebidos:', dados);
    const dataFiltrada = dados.filter((dado) => {
      const mes = parseInt(dado.data.split('/')[1], 10);
      return (
        mes === parseInt(this.valorSelecionado) &&
        (this.filtro != '' ? dado.tipo === this.filtro : true)
      );
    });
    this.contatos = dataFiltrada;

    this.atualizarDadosGrafico();
  }

  atualizarDadosGrafico() {
    if (this.contatos && this.contatos.length > 0) {
      const contagemCategorias: { [categoria: string]: number } = {};
      const contagemTipos: { [tipo: string]: number } = {};

      this.contatos.forEach((objeto) => {
        if (contagemCategorias[objeto.categoria]) {
          contagemCategorias[objeto.categoria] += objeto.valor;
        } else {
          contagemCategorias[objeto.categoria] = objeto.valor;
        }

        if (contagemTipos[objeto.tipo]) {
          contagemTipos[objeto.tipo] += objeto.valor;
        } else {
          contagemTipos[objeto.tipo] = objeto.valor;
        }
      });

      const labels1 = Object.keys(contagemCategorias);
      const data1 = Object.values(contagemCategorias);

      const labels2 = Object.keys(contagemTipos);
      const data2 = Object.values(contagemTipos);

      this.data = {
        labels: labels1,
        datasets: [
          {
            data: data1,
            backgroundColor: ['blue', 'yellow', 'green'],
            hoverBackgroundColor: ['lightblue', 'lightyellow', 'lightgreen'],
          },
        ],
      };

      this.data2 = {
        labels: labels2,
        datasets: [
          {
            data: data2,
            backgroundColor: ['green', 'red'],
            hoverBackgroundColor: ['lightblue', 'lightyellow'],
          },
        ],
      };

      this.dados = true;
    } else {
      this.dados = false;
    }

    this.options = {
      responsive: false,
      maintainAspectRatio: false,
      barPercentage: 0.2,
      cutout: '70%',
      borderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
