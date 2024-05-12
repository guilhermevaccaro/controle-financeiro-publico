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
        console.log('objeto', objeto);
        console.log('data', data);
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
    this.serviceContato
      .getTransacoesPorIntervaloDeDatas(
        this.form.value.rangeDates[0],
        this.form.value.rangeDates[1]
      )
      .subscribe((transacoes) => {
        this.contatos = transacoes;
      });
  }

  exportPdf() {
    this.dadosPDF = this.contatos
      .map((contato) => {
        const partesData = contato.data.split('/');
        const timestamp = new Date(
          partesData[2],
          partesData[1] - 1,
          partesData[0]
        ).getTime();
        if (contato.situacao === true) {
          contato.situacao = 'Efetivado';
        } else {
          contato.situacao = 'Pendente';
        }
        return {
          data: contato.data,
          timestamp: timestamp,
          situacao: contato.situacao,
          fornecedor: contato.fornecedor.razao,
          item: contato.peca.item,
          quantidade: contato.peca.quantidade,
          valor: contato.valor,
          valorTotal: contato.valorTotal,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

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
