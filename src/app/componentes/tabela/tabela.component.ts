import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transacao } from 'src/app/models/Transacao';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent {
  @Input() contatos!: Transacao[];
  @Input() filtro!: string;
  @Input() valorSelecionado!: string;
  @Output() open = new EventEmitter(false);
  @Output() openAdd = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnChanges() {
    if (this.contatos) {
      console.log(this.contatos);
    }
  }

  deletandoTransacao(key: Transacao, quantidade: Transacao, keyPeca: Transacao, tipo: Transacao) {
    const dados = { key, quantidade, keyPeca, tipo };
    this.remove.emit(dados);
    console.log(dados);
  }
  abrindoModal(tipo: string, transacao?: Transacao) {
    if (transacao) {
      this.open.emit(transacao);
    } else {
      this.openAdd.emit(tipo);
    }
  }
  confirm(event: Event, key: Transacao, quantidade: Transacao, keyPeca: any, tipo: any) {
    console.log(quantidade);
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
        this.deletandoTransacao(key, quantidade, keyPeca, tipo);
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
}
