import { Component, Input, SimpleChanges } from '@angular/core';
import { Categoria } from 'src/app/models/Categoria';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';
import { Chart } from 'chart.js';

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
  data: any;
  data2: any;
  options: any;

  constructor(private serviceContato: ContatoService) {}

  ngOnInit(): void {
    this.carregar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('valorSelecionado' in changes) {
      this.carregar();
    }
  }
  carregar() {
    this.serviceContato.getCollection('transacoes').subscribe((items) => {
      const dataFiltrada = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return (
          mes === parseInt(this.valorSelecionado) &&
          (this.filtro != '' ? item.tipo === this.filtro : true)
        );
      });
      this.contatos = dataFiltrada;
      this.atualizarDadosGrafico();
    });
  }

  atualizarDadosGrafico() {
    if (this.contatos && this.contatos.length > 0) {
      const contagemCategorias: { [categoria: string]: number } = {};

      this.contatos.forEach((objeto) => {
        if (contagemCategorias[objeto.categoria]) {
          contagemCategorias[objeto.categoria] += objeto.valor;
        } else {
          contagemCategorias[objeto.categoria] = objeto.valor;
        }
      });

      const labels = Object.keys(contagemCategorias);
      const data = Object.values(contagemCategorias);

      this.data = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['blue', 'yellow', 'green'],
            hoverBackgroundColor: ['lightblue', 'lightyellow', 'lightgreen'],
          },
        ],
      };
      const contagemTipos: { [tipo: string]: number } = {};

      this.contatos.forEach((objeto) => {
        if (contagemTipos[objeto.tipo]) {
          contagemTipos[objeto.tipo] += objeto.valor;
        } else {
          contagemTipos[objeto.tipo] = objeto.valor;
        }
      });

      const labels1 = Object.keys(contagemTipos);
      const data2 = Object.values(contagemTipos);

      this.data2 = {
        labels: labels1,
        datasets: [
          {
            data: data2,
            backgroundColor: ['blue', 'yellow', 'green'],
            hoverBackgroundColor: ['lightblue', 'lightyellow', 'lightgreen'],
          },
        ],
      };
    } else {
      console.log('Nenhum contato encontrado para contar categorias.');
    }
    this.options = {
      barPercentage: 0.2,
      cutout: '80%',
      borderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }

  // showModal(formData: any) {
  //   this.formData = formData;
  //   this.visible = true;
  // }

  // showModalAdd(tipo: string) {
  //   this.tipo = tipo;
  //   this.formData = null;
  //   this.visible = true;
  // }

  // onRemove(key: string) {
  //   this.serviceContato.deleteDocument('transacoes', key);
  // }

  // public closeModal() {
  //   this.visible = false;
  // }
}
