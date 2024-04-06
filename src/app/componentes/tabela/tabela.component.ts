import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent {
  @Input() contatos!: Transacao[];

  @Output() open = new EventEmitter(false);
  @Output() openAdd = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  deletandoTransacao(key: Transacao) {
    this.remove.emit(key);
  }
  abrindoModal(tipo: string, transacao?: Transacao) {
    if (transacao) {
      this.open.emit(transacao);
    } else {
      this.openAdd.emit(tipo);
    }
  }
  confirm(event: Event, key: Transacao) {
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
        this.deletandoTransacao(key);
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
