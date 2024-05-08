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
  situacaoLabel: string = 'Pendente';
  estoque: ItemEstoque[] = [];

  @Input() formData!: Transacao;
  @Input() tipo: string = '';
  @Input() categoria: string = '';
  @Output() close = new EventEmitter();
  estoqueSubscription!: Subscription;

  quantidade!: number;
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
  }

  private criarForm() {
    return this.formBuilder.group({
      id: [''],
      data: ['', Validators.required],
      descricao: ['', Validators.required],
      peca: ['', Validators.required],
      fornecedor: ['', Validators.required],
      situacao: [''],
      tipo: [this.tipo],
      quantidade: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0)]],
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

  onSubmit() {
    const {
      id,
      data,
      descricao,
      peca,
      fornecedor,
      situacao,
      tipo,
      quantidade,
      valor,
    } = this.form.value;
    const { item } = peca;
    const formData = {
      id,
      data,
      descricao,
      item,
      fornecedor,
      situacao,
      tipo,
      quantidade,
      valor,
    };

    console.log(formData);

    if (formData.id === null || formData.id === '') {
      this.contatoService.addDocument('transacoes', formData);

      const quantidade =
        this.categoria === 'Compra de peça'
          ? this.quantidade + formData.quantidade
          : this.quantidade - formData.quantidade;

          console.log(quantidade);

      this.contatoService.updateDocument('estoque', peca.id, {
        quantidade: quantidade,
      });
    } else {
      this.contatoService.updateDocument('transacoes', formData.id, formData);
    }
    this.form = this.criarForm();
    this.close.emit();
  }

  onCancel() {
    this.form = this.criarForm();
    this.close.emit();
  }

  selecionouPeca(event: any) {
    this.quantidade = event.value.quantidade;
  }
}
