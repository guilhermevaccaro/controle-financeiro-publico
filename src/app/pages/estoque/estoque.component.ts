import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Estoque } from 'src/app/models/Estoque';
import { Fornecedor } from 'src/app/models/Pedido';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css'],
})
export class EstoqueComponent implements OnInit {
  estoque!: Estoque[];
  fornecedor!: Fornecedor[];
  visible = false;
  visibleRazao = false;
  formData!: Estoque;

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
      this.estoque = items;
    });
    this.service.getCollection('fornecedor').subscribe((items) => {
      this.fornecedor = items;
    });
  }

  deletandoTransacao(tabela: string, key: string) {
    this.service.deleteDocument(tabela, key);
  }

  confirm(event: Event, key: string, tabela: string) {
    console.log(event, key, tabela);
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

  showModalEdit(formData: Estoque) {
    this.formData = formData;
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
    this.visibleRazao = false;
  }
}
