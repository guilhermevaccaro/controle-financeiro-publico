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
  @Input() tipoTransacao: string = '';

  @Output() edit = new EventEmitter(false);
  @Output() open = new EventEmitter(false);
  @Output() openAdd = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  @Output() addDespesa = new EventEmitter<{ evento: any; tipo: string }>();
  @Output() addReceita = new EventEmitter<{ evento: any; tipo: string }>();

  constructor(
    private transacaoService: ContatoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  adicionarTransacao(tipo: string) {
    if (tipo === 'despesa') {
      this.addDespesa.emit({ evento: true, tipo: tipo });
    } else if (tipo === 'receita') {
      this.addReceita.emit({ evento: true, tipo: tipo });
    }
  }
  editandoTransacao(transacao: Transacao) {
    this.edit.emit(transacao);
  }
  deletandoTransacao(key: Transacao) {
    this.remove.emit(key);
  }
  abrindoModal(tipo: string, transacao?: Transacao) {
    if (transacao) {
      this.open.emit(transacao); // Se houver uma transação, emite um sinal para abrir o modal de edição
    } else {
      this.openAdd.emit(tipo); // Se não houver uma transação, emite um sinal para abrir o modal de adição
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
      acceptLabel: 'Sim', // Texto para o botão "Sim" (ou "Yes")
      rejectLabel: 'Não', // Texto para o botão "Não" (ou "No")

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
