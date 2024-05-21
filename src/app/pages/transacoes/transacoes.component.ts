import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { RangeDate } from 'src/app/models/RangeDate';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-transacoes',
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css'],
})
export class TransacoesComponent implements OnInit {
  filtro!: string;
  contatos!: Pedido[];
  opcoes = [
    { label: 'Transações', value: 'transacoes' },
    { label: 'Receitas', value: 'receita' },
    { label: 'Despesas', value: 'despesa' },
  ];

  despesaPendente!: number;
  despesaPagas!: number;
  somaReceita!: number;
  somaDespesa!: number;
  saldoPrevisto!: number;
  saldoMes!: number;
  saldoPendente!: number;
  opcoesSelecionadas!: string;
  receitaPendente!: number;
  receitaRecebidas!: number;
  formData!: Pedido;
  visible = false;
  visibleEdit = false;
  quantidadeAtual!: number;
  inicio!: Date;
  fim!: Date;
  public tipo = '';

  constructor(
    private serviceContato: ContatoService,
    private route: ActivatedRoute
  ) {}
  @Output() remove = new EventEmitter(false);
  deletandoTransacao(key: Pedido) {
    this.remove.emit(key);
  }
  ngOnInit() {
    this.carregar();
  }

  onDialogShow() {
  console.log('O diálogo está sendo aberto.');
}


  alterarSituacao(pedido: Pedido) {
    pedido.situacao.nome =
      pedido.situacao.nome === 'Pendente' ? 'Efetivado' : 'Pendente';

    this.serviceContato.updateDocument('transacoes', pedido.id, {
      'situacao.nome': pedido.situacao.nome,
    });
  }
  pegaTipoUrl() {
    this.route.url.subscribe((segments) => {
      const ultimaSegmento = segments[segments.length - 1];
      this.opcoesSelecionadas = ultimaSegmento.path;
    });
  }

  onDateSelectRecebido(event: RangeDate) {
    this.inicio = event.startDate;
    this.fim = event.endDate;
    if (this.inicio && this.fim) {
      this.carregar();
    }
  }

  showModal(formData: Pedido) {
    this.formData = formData;
    this.visible = true;
  }

  showModalEdit(formData: Pedido) {
    this.formData = formData;
    this.visibleEdit = true;
  }

  public closeModal() {
    console.log('close');
    this.visible = false;
    this.visibleEdit = false;
  }

  onRemove(objeto: Pedido) {
    this.updateEstoque(objeto);
    this.serviceContato.deleteDocument('transacoes', objeto.id);
  }
  private updateEstoque(formData: Pedido) {
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
    console.log(this.inicio, this.fim);
    this.serviceContato
      .getTransacoesPorIntervaloDeDatas(this.inicio, this.fim)
      .subscribe((transacoes) => {
        if (this.filtro === 'despesa') {
          this.contatos = transacoes.filter(
            (Pedido) => Pedido.tipo === 'despesa'
          );
        } else if (this.filtro === 'receita') {
          this.contatos = transacoes.filter(
            (Pedido) => Pedido.tipo === 'receita'
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
            somaDespesas += valorTotal;
            if (Pedido.situacao.nome === 'Efetivado') {
              somaDespesasEfetivadas += valorTotal;
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
