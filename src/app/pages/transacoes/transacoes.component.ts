import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-transacoes',
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css'],
})
export class TransacoesComponent {
  filtro!: string;
  contatos!: Transacao[];
  valorSelecionado!: any;
  opcoes = [
    { label: 'Transações', value: 'transacoes' },
    { label: 'Receitas', value: 'receita' },
    { label: 'Despesas', value: 'despesa' },
  ];

  despesaPendente!: number;
  despesaPagas!: number;
  form!: any;
  somaReceita!: number;
  somaDespesa!: number;
  saldoPrevisto!: number;
  saldoMes!: number;
  saldoPendente!: number;
  opcoesSelecionadas!: string;
  receitaPendente!: number;
  receitaRecebidas!: number;
  formData: any;
  visible: boolean = false;
  public tipo: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private serviceContato: ContatoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  @Output() open = new EventEmitter(false);
  @Output() openAdd = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  deletandoTransacao(key: Transacao) {
    this.remove.emit(key);
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      mes: [new Date()],
    });
    this.valorSelecionado = new Date().getMonth() + 1;
    this.carregar();
  }

  onOpcaoSelecionada(event: { value: any }) {
    this.pegaTipoUrl();

    this.opcoesSelecionadas = event.value;
    this.carregar();
  }

  pegaTipoUrl() {
    this.route.url.subscribe((segments) => {
      const ultimaSegmento = segments[segments.length - 1];
      this.opcoesSelecionadas = ultimaSegmento.path;
    });
  }

  onDateSelect(event: any) {
    const selectedDate: Date = event;
    this.valorSelecionado = selectedDate.getMonth() + 1;
    this.carregar();
  }

  showModal(formData: any) {
    this.formData = formData;
    this.visible = true;
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

  carregar() {
    this.pegaTipoUrl();
    this.filtro = this.opcoesSelecionadas;
    this.serviceContato.getCollection('transacoes').subscribe((items) => {
      const dataFiltrada = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return (
          mes === parseInt(this.valorSelecionado) &&
          (this.filtro !== 'transacoes' ? item.tipo === this.filtro : true)
        );
      });
      this.contatos = dataFiltrada;

      const dadosEfetivados = dataFiltrada.filter(
        (item) => item.situacao === true
      );

      this.receitaPendente = this.contatos
        .filter((item) => item.tipo === 'receita' && item.situacao !== true)
        .map((item) => item.valor)
        .reduce((total, valor) => total + valor, 0);

      this.receitaRecebidas = this.contatos
        .filter((item) => item.tipo === 'receita' && item.situacao === true)
        .map((item) => item.valor)
        .reduce((total, valor) => total + valor, 0);

      this.somaReceita = this.contatos
        .filter((item) => item.tipo === 'receita')
        .map((item) => item.valor)
        .reduce((total, valor) => total + valor, 0);

      this.despesaPendente = this.contatos
        .filter((item) => item.tipo === 'despesa' && item.situacao !== true)
        .map((item) => item.valor)
        .reduce((total, valor) => total + valor, 0);

      this.despesaPagas = this.contatos
        .filter((item) => item.tipo === 'despesa' && item.situacao === true)
        .map((item) => item.valor)
        .reduce((total, valor) => total + valor, 0);

      this.somaDespesa = this.contatos
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

      const dadosPendentes = dataFiltrada.filter(
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
