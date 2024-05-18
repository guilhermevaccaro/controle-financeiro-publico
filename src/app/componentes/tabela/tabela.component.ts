import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableFilterEvent } from 'primeng/table';
import { Fornecedor, Peca, Pedido } from 'src/app/models/Pedido';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent implements OnInit {
  @Input() contatos!: Pedido[];
  @Output() clickOpen = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  @Output() dateSelect = new EventEmitter(false);
  dt1!: Table;
  filteredContatos = [];
  novoArrayComDadosFiltrados!: Pedido[];
  dadosPDF!: any[];

  exportColumns!: { title: string; dataKey: string }[]; // Specify a more specific type for exportColumns

  cols!: { field: string; header: string }[];
  form!: FormGroup;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {}
  customInputStyle = {
    cursor: 'pointer',
    'text-align': 'center',
    'border-radius': '25px',
  };
  ngOnInit() {
    const dataInicio = new Date();
    dataInicio.setDate(1);

    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + 1);
    dataFim.setDate(0);

    this.form = this.formBuilder.group({
      rangeDates: [[dataInicio, dataFim]],
    });
    this.emitDateSelect(); // Remove the argument from the method call
  }
  deletandoTransacao(pedido: Pedido[]) {
    this.remove.emit(pedido);
  }
  abrindoModal(pedido: Pedido[]) {
    if (pedido) {
      this.clickOpen.emit(pedido);
    }
  }
  emitDateSelect() {
    const startDate = new Date(this.form.value.rangeDates[0]);
    const endDate = new Date(this.form.value.rangeDates[1]);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    this.dateSelect.emit({ startDate, endDate } as {
      startDate: Date;
      endDate: Date;
    });
  }
  confirm(event: Event, data: Pedido[]) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir o dado?',
      header: 'Confirme Exclusão',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',

      accept: () => {
        this.deletandoTransacao(data);
        this.messageService.add({
          severity: 'info',
          summary: 'Sucesso',
          detail: 'Dado excluído',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Rejeitado',
        });
      },
    });
  }
  clear(table: Table) {
    table.clear();
  }
  onFilterGlobal(event: Event, table: Table) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  onTableFilter(event: TableFilterEvent) {
    console.log('event ', event);
    this.filteredContatos = event.filteredValue;
  }

  exportPdf() {
    this.novoArrayComDadosFiltrados = [...this.filteredContatos];
    function formatDate(dateString: string) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    }

    this.dadosPDF = this.novoArrayComDadosFiltrados
      .map(
        (contato: {
          situacao: { nome: string };
          data: string;
          fornecedor: Fornecedor;
          pecas: Peca[];
          valorTotal: number;
        }) => {
          if (contato.situacao.nome === 'Efetivado') {
            contato.situacao.nome = 'Efetivado';
          } else {
            contato.situacao.nome = 'Pendente';
          }

          return {
            data: formatDate(contato.data),
            situacao: contato.situacao.nome,
            fornecedor: contato.fornecedor.nome,
            pecas: contato.pecas.map((peca) => peca.item).join(', '),
            quantidade: contato.pecas,
            valorTotal: contato.valorTotal,
          };
        }
      )
      .sort((a, b) => {
        const dateA = new Date(a.data.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.data.split('/').reverse().join('-')).getTime();
        return dateA - dateB;
      });
    console.log('this.dadosPDF ', this.dadosPDF);

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
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        const title = 'Relatório de Pedidos';
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleXPosition = pageWidth / 2; // Centralizar título
        doc.setFontSize(18); // Tamanho da fonte do título
        doc.text(title, titleXPosition, 30, { align: 'center' });
        (doc as any).autoTable(this.exportColumns, this.dadosPDF);
        console.log('doc ', doc);
        doc.save(`pedidos${new Date().toLocaleDateString()}.pdf`);
      });
    });
  }
}
