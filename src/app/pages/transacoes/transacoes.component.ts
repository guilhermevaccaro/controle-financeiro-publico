import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style,
} from '@angular/animations';

import { Component, EventEmitter, Output } from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  opcoes!: any[];
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceContato: ContatoService
  ) {
    this.carregar();
  }
  @Output() open = new EventEmitter(false);
  @Output() openAdd = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  deletandoTransacao(key: Transacao) {
    this.remove.emit(key);
  }
  ngOnInit() {
    this.opcoes = [
      { name: 'transacoes' },
      { name: 'receitas' },
      { name: 'despesas' },
    ];
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
  carregar() {
    this.serviceContato.getCollection('transacoes').subscribe((items) => {
      const dataFiltrada = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return (
          mes === parseInt(this.valorSelecionado) &&
          (this.filtro != '' ? item.tipo === this.filtro : true)
        );
      });
      this.contatos = items;
      console.log(this.contatos);
    });
  }
}
