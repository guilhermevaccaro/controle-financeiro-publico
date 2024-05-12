import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

interface ItemEstoque {
  item: string;
  id: string;
}

@Component({
  selector: 'app-form-adicionar-remover-estoque',
  templateUrl: './form-adicionar-remover-estoque.component.html',
  styleUrls: ['./form-adicionar-remover-estoque.component.css'],
})
export class FormAdicionarRemoverEstoqueComponent {
  form!: FormGroup;
  situacaoLabel = 'Pendente';
  estoque: ItemEstoque[] = [];
  razao: ItemEstoque[] = [];

  @Input() formData!: Transacao;
  @Input() tipo = '';
  @Input() categoria = '';
  @Output() close = new EventEmitter();
  estoqueSubscription!: Subscription;
  razaoSubscription!: Subscription;

  quantidade = 0;
  idPeca!: string;
  novaTransacao: any;
  constructor(
    private formBuilder: FormBuilder,
    private contatoService: ContatoService
  ) {}

  ngOnInit() {
    this.form = this.criarForm();
    this.estoqueSubscription = this.contatoService
      .getCollection('estoque')
      .subscribe((items) => {
        this.estoque = [];
        items.forEach((item) => {
          this.estoque.push(item);
        });
      });
    this.razaoSubscription = this.contatoService
      .getCollection('razao')
      .subscribe((items) => {
        this.razao = [];
        items.forEach((item) => {
          this.razao.push(item);
        });
      });
  }

  private criarForm() {
    return this.formBuilder.group({
      data: ['', Validators.required],
      descricao: ['', Validators.required],
      peca: ['', Validators.required],
      fornecedor: ['', Validators.required],
      situacao: [''],
      tipo: [this.tipo],
      quantidade: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0)]],
      valorTotal: [''],
    });
  }

  ngOnChanges() {
    if (this.formData) {
      this.atualizarFormulario();
    } else {
      this.form = this.criarForm();
    }
  }

  atualizarFormulario() {
    this.form.patchValue(this.formData);
    this.atualizarLabel();
  }

  atualizarLabel() {
    this.situacaoLabel = this.form.value.situacao ? 'Efetivado' : 'Pendente';
  }

  async onSubmit(novaTransacao: any): Promise<void> {
    try {
      if (!novaTransacao.id || novaTransacao.id === '') {
        const novoDocumentoId = await this.contatoService.addDocument(
          'transacoes',
          novaTransacao
        );
        console.log('Novo documento adicionado com o ID:', novoDocumentoId);
      } else {
        await this.contatoService.updateDocument(
          'transacoes',
          novaTransacao.id,
          novaTransacao
        );
        console.log('Documento atualizado com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  }

  onCancel() {
    this.form = this.criarForm();
    this.close.emit();
  }

  selecionouPeca(event: any) {
    console.log(event.value);
    this.quantidade = event.value.quantidade;
    console.log(this.quantidade);
  }
  selecionouRazao(event: any) {
    // console.log(event.value);
    // this.quantidade = event.value.quantidade;
    // console.log(this.quantidade);
  }
}
