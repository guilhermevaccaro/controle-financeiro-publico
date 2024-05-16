import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-transacoes',
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css'],
})
export class TransacoesComponent implements OnInit {
  filtro!: string;
  contatos!: any[];
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
  visible = false;
  quantidadeAtual!: number;
  public tipo = '';

  rangeDates: Date[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private serviceContato: ContatoService,
    private route: ActivatedRoute
  ) {}

  @Output() open = new EventEmitter(false);
  @Output() openAdd = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  deletandoTransacao(key: Transacao) {
    this.remove.emit(key);
  }
  ngOnInit() {
    const dataInicio = new Date();
    dataInicio.setDate(1);

    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + 1);
    dataFim.setDate(0);

    this.form = this.formBuilder.group({
      rangeDates: [[dataInicio, dataFim]],
    });
    this.carregar();
  }
  customInputStyle = {
    cursor: 'pointer',
    'text-align': 'center',
    'border-radius': '25px',
  };

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

  onDateSelect() {
    this.carregar();
  }

  showModal(formData: any) {
    this.formData = formData;
    this.visible = true;
  }

  public closeModal() {
    this.visible = false;
  }

  onRemove(objeto: any) {
    this.updateEstoque(objeto);
    this.serviceContato.deleteDocument('transacoes', objeto.id);
  }
  private updateEstoque(formData: any) {
    for (const peca of formData.pecas) {
      const quantidade = peca.item.quantidade;
      this.serviceContato
        .updateDocument('estoque', peca.idPeca, { quantidade: quantidade })
        .catch((err) => console.error('Error updating estoque', err));
    }
  }
  carregar() {
    this.pegaTipoUrl();
    this.filtro = this.opcoesSelecionadas;
    this.serviceContato
      .getTransacoesPorIntervaloDeDatas(
        this.form.value.rangeDates[0],
        this.form.value.rangeDates[1]
      )
      .subscribe((transacoes) => {
        if (this.filtro === 'despesa') {
          this.contatos = transacoes.filter(
            (transacao) => transacao.tipo === 'despesa'
          );
        } else if (this.filtro === 'receita') {
          this.contatos = transacoes.filter(
            (transacao) => transacao.tipo === 'receita'
          );
        } else {
          this.contatos = transacoes;
        }

        let somaReceitas = 0;
        let somaDespesas = 0;
        let somaReceitasEfetivadas = 0;
        let somaReceitasPendentes = 0;
        let somaDespesasEfetivadas = 0;
        let somaDespesasPendentes = 0;

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
        this.receitaRecebidas = somaReceitasEfetivadas;
        this.receitaPendente = somaReceitasPendentes;
        this.despesaPagas = somaDespesasEfetivadas;
        this.despesaPendente = somaDespesasPendentes;
      });
  }
}
