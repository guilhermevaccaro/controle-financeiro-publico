import { trigger } from '@angular/animations';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  animations: [trigger('animSlider', [])],
})
export class PagesComponent {
  form!: FormGroup;
  @Input() valorSelecionado!: any;
  formData: any;
  visible: boolean = false;
  public tipo: string = '';
  tabIndex = 0;
  activeTab = 0;
  products!: any[];

  contatos!: Transacao[];
  filtro!: string;
  saldoPrevisto = 0;
  saldoPendente = 0;
  saldoMes = 0;
  dados!: Transacao[];
  dadosReceita!: Transacao[];
  dadosDespesa!: Transacao[];
  somaReceita = 0;
  somaDespesa = 0;
  items!: MenuItem[];

  constructor(
    private formBuilder: FormBuilder,
    private config: PrimeNGConfig,
    private serviceContato: ContatoService
  ) {
    this.form = this.formBuilder.group({
      mes: [new Date()],
    });

    this.valorSelecionado = new Date().getMonth() + 1;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {},
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {},
          },
        ],
      },
      {
        label: 'Navigate',
        items: [
          {
            label: 'Angular',
            icon: 'pi pi-external-link',
            url: 'http://angular.io',
          },
          {
            label: 'Router',
            icon: 'pi pi-upload',
            routerLink: '/fileupload',
          },
        ],
      },
    ];
    this.calculaSaldos();
    this.config.setTranslation({
      apply: 'Aplicar',
      clear: 'Limpar',
      accept: 'Sim',
      reject: 'Não',
      firstDayOfWeek: 0,
      dayNames: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
      ],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      today: 'Hoje',
    });
  }

  onDateSelect(event: any) {
    const selectedDate: Date = event;
    this.valorSelecionado = selectedDate.getMonth() + 1;
    this.calculaSaldos();
  }

  showModal(formData: any) {
    this.formData = formData;
    this.visible = true;
  }
  abrindoModal(tipo: string, transacao?: Transacao) {
    this.visible;
  }

  showModalAdd(tipo: string) {
    this.tipo = tipo;
    this.formData = null;
    this.visible = true;
  }
  public closeModal() {
    this.visible = false;
  }

  onRemove(key: string) {
    this.serviceContato.deleteDocument('transacoes', key);
  }

  calculaSaldos() {
    console.log('calculasaldo');
    this.serviceContato.getCollection('transacoes').subscribe((items) => {
      const dataFiltradaPendente = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return mes === parseInt(this.valorSelecionado);
      });
      this.dados = dataFiltradaPendente;

      console.log(dataFiltradaPendente);

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
      console.log(this.saldoMes);

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
