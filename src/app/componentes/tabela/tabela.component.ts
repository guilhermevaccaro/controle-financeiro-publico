import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Transacao } from 'src/app/models/Transacao';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent {
  @Input() contatos!: any[];
  @Output() clickOpen = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  dt1: any;
  filteredContatos = [];
  novoArrayComDadosFiltrados = [];
  dadosPDF!: any[];
  exportColumns!: any[];
  cols!: any[];
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  deletandoTransacao(data: Transacao) {
    this.remove.emit(data);
  }
  abrindoModal(transacao: Transacao) {
    if (transacao) {
      this.clickOpen.emit(transacao);
    }
  }
  confirm(event: Event, data: Transacao) {
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
  onFilterGlobal(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  onTableFilter(event: any) {
    this.filteredContatos = event.filteredValue;
    console.log('Filtrando dados:', this.filteredContatos);
  }
  criarNovoArrayComDadosFiltrados(table: any) {
    this.novoArrayComDadosFiltrados = [...this.filteredContatos];
  }
  exportPdf() {
    this.criarNovoArrayComDadosFiltrados(this.dt1);
    function formatDate(dateString: any) {
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
          data: any;
          fornecedor: { nome: any };
          pecas: { item: any; quantidade: any };
          valorTotal: any;
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
            pecas: contato.pecas.item,
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
        doc.save(`pedidos${new Date().toLocaleDateString()}.pdf`);
      });
    });
  }
}
