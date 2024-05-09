import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';

interface ContagemCategorias {
  [categoria: string]: number;
}

interface ContagemTipos {
  [tipo: string]: number;
}

interface Porcentagens {
  [categoria: string]: string;
}
@Component({
  selector: 'app-transacoes-lista',
  templateUrl: './transacoes-lista.component.html',
  styleUrls: ['./transacoes-lista.component.css'],
})
export class TransacoesListaComponent implements OnChanges {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dados1'] && changes['dados1'].currentValue) {
      this.processarDados(this.dados1);
      console.log(this.dados1);
    }
  }

  private processarDados(dados: Transacao[]): void {
    const dataFiltrada = dados.filter((dado) => {
      const mes = Number(dado.data.split('/')[1]);
      return (
        mes === Number(this.valorSelecionado) &&
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

      let total = 0;
      for (const categoria in contagemCategorias) {
        total += contagemCategorias[categoria];
      }

      const porcentagens: { [categoria: string]: string } = {};
      for (const categoria in contagemCategorias) {
        const porcentagem = (contagemCategorias[categoria] / total) * 100;
        porcentagens[categoria] = porcentagem.toFixed(1);
      }

      const labels1 = Object.keys(contagemCategorias);
      const data1 = Object.values(porcentagens);

      const data2 = [
        contagemTipos['receita'] || 0,
        contagemTipos['despesa'] || 0,
      ];

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
        labels: ['Receita', 'Despesa'],
        datasets: [
          {
            data: data2,
            backgroundColor: ['green', 'red'],
            hoverBackgroundColor: ['lightgreen', 'pink'],
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
