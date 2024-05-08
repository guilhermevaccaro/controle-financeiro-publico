import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css'],
})
export class EstoqueComponent implements OnInit {
  contatos!: any[];
  razao!: any[];
  contatosEntrada!: any[];
  contatosSaida!: any[];
  visible = false;
  precoTotal!: number;
  produtos: any[] = [];
  visibleRazao = false;
  @Output() open = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);
  formData!: any;

  constructor(
    private service: ContatoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carrega();
  }
  carrega() {
    this.service.getCollection('estoque').subscribe((items) => {
      this.contatos = items;
    });
    this.service.getCollection('razao').subscribe((items) => {
      this.razao = items;
    });
  }

  deletandoTransacao(tabela: any, key: any) {
    this.service.deleteDocument(tabela, key);
  }

  confirm(event: Event, key: any, tabela: any) {
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
        this.deletandoTransacao(tabela, key);
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

  showModal() {
    this.visible = true;
  }

  showModalRazao() {
    this.visibleRazao = true;
  }

  showModalEdit(formData: any) {
    this.formData = formData;
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
    this.visibleRazao = false;
  }
}
