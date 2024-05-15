import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first, take } from 'rxjs';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-transacoes',
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css'],
})
export class TransacoesComponent {
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
  dadosPDF!: any[];
  exportColumns!: any[];
  cols!: any[];
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

  onDateSelect(event: any) {
    this.carregar();
  }

  showModal(formData: any) {
    console.log(formData);
    this.formData = formData;
    this.visible = true;
  }

  public closeModal() {
    this.visible = false;
  }

  onRemove(objeto: any) {
    this.serviceContato.deleteDocument('transacoes', objeto.id);
    this.serviceContato
      .getDocumentById('estoque', objeto.peca.id)
      .pipe(first())
      .subscribe((data) => {
        let quantidadeMudanca = 0;
        if (objeto.tipo === 'receita') {
          quantidadeMudanca = data.quantidade + objeto.quantidade;
        } else if (objeto.tipo === 'despesa') {
          quantidadeMudanca = data.quantidade - objeto.quantidade;
        }

        this.serviceContato.updateDocument('estoque', objeto.peca.id, {
          quantidade: quantidadeMudanca,
        });
      });
  }

  carregar() {
    this.pegaTipoUrl();
    this.filtro = this.opcoesSelecionadas;
    console.log(this.filtro);
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
          console.log(this.contatos);
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
        this.receitaRecebidas = somaReceitasEfetivadas;
        this.receitaPendente = somaReceitasPendentes;
        this.despesaPagas = somaDespesasEfetivadas;
        this.despesaPendente = somaDespesasPendentes;
      });
  }

  exportPdf() {
    function formatDate(dateString: any) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    }

    this.dadosPDF = this.contatos
      .map((contato) => {
        if (contato.situacao.nome === 'Efetivado') {
          contato.situacao.nome = 'Efetivado';
        } else {
          contato.situacao.nome = 'Pendente';
        }

        return {
          data: formatDate(contato.data),
          situacao: contato.situacao.nome,
          fornecedor: contato.fornecedor.razao,
          item: contato.peca,
          quantidade: contato.peca,
          valorTotal: contato.valorTotal,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.data.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.data.split('/').reverse().join('-')).getTime();
        return dateA - dateB;
      });

    this.cols = [
      { field: 'data', header: 'Data' },
      { field: 'situacao', header: 'Situação' },
      { field: 'fornecedor', header: 'Fornecedor/Cliente' },
      { field: 'item', header: 'Item' },
      { field: 'quantidade', header: 'Quantidade' },
      { field: 'valor', header: 'Valor Unitário' },
      { field: 'valorTotal', header: 'Valor Total' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.dadosPDF);
        doc.save('products.pdf');
      });
    });
  }
}
