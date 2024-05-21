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
    private messageService: MessageService,
    private serviceContato: ContatoService
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
  updateEstoque() {
    const somaQuantidades: { [key: string]: number } = {};

    const subscription = this.serviceContato
      .getCollection('transacoes')
      .subscribe({
        next: (items) => {
          items.forEach((transacao) => {
            transacao.pecas.forEach(
              (peca: { idPeca: any; quantidadeAdicionada: any }) => {
                const idPeca = peca.idPeca;
                let quantidadeAdicionada = peca.quantidadeAdicionada;

                // Verificar o tipo de transação
                if (transacao.tipo === 'receita') {
                  // Se for receita, diminui a quantidade
                  quantidadeAdicionada = -quantidadeAdicionada;
                }
                // Se for despesa, aumenta a quantidade (comportamento padrão)

                // Acumular a quantidade no objeto somaQuantidades
                if (somaQuantidades.hasOwnProperty(idPeca)) {
                  somaQuantidades[idPeca] += quantidadeAdicionada;
                } else {
                  somaQuantidades[idPeca] = quantidadeAdicionada;
                }
              }
            );
          });

          console.log('Soma das quantidades adicionadas:', somaQuantidades);

          // Itera sobre o objeto somaQuantidades e atualiza o estoque para cada peça
          for (const idPeca in somaQuantidades) {
            if (somaQuantidades.hasOwnProperty(idPeca)) {
              const quantidadeAdicionada = somaQuantidades[idPeca];

              console.log(
                `Atualizar estoque para peça ${idPeca}, quantidade ajustada: ${quantidadeAdicionada}`
              );
              this.serviceContato.updateDocument('estoque', idPeca, {
                quantidade: quantidadeAdicionada,
              });
            }
          }

          // Cancelar a assinatura após receber as respostas
          subscription.unsubscribe();
        },
        error: (err) =>
          console.error('Erro ao obter coleção de transações:', err),
      });
  }
}
