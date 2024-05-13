// Seu código Angular TypeScript

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class FormAdicionarRemoverEstoqueComponent implements OnInit, OnChanges {
  @Input() formData!: any;
  @Input() tipo = '';
  @Input() categoria = '';
  @Output() close = new EventEmitter();
  estoqueSubscription!: Subscription;
  form!: FormGroup;
  estoque: ItemEstoque[] = [];
  nome: ItemEstoque[] = [];
  razaoSubscription!: Subscription;
  quantidade = 0;
  idPeca!: string;
  novaTransacao: any;
  situacaoOpcoes!: any[];

  constructor(
    private formBuilder: FormBuilder,
    private contatoService: ContatoService
  ) {}

  ngOnInit() {
    this.form = this.criarForm();
    this.situacaoOpcoes = [
      {
        nome: 'Pendente',
      },
      { nome: 'Efetivado' },
    ];
    this.estoqueSubscription = this.contatoService
      .getCollection('estoque')
      .subscribe((items) => {
        this.estoque = [];
        items.forEach((item) => {
          this.estoque.push(item);
        });
      });
    this.razaoSubscription = this.contatoService
      .getCollection('fornecedor')
      .subscribe((items) => {
        this.nome = [];
        items.forEach((item) => {
          this.nome.push(item);
        });
      });
  }

  private criarForm() {
    return this.formBuilder.group({
      id: [''],
      data: ['', Validators.required],
      categoria: [this.categoria],
      descricao: ['', Validators.required],
      pecas: this.formBuilder.array([]), // FormArray para múltiplas peças
      fornecedor: ['', Validators.required],
      situacao: ['', Validators.required],
      tipo: [this.tipo],
      quantidade: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0)]],
      valorTotal: [''],
    });
  }

  ngOnChanges() {
    if (this.formData) {
      console.log(this.formData);

      this.atualizarFormulario();
    } else {
      this.form = this.criarForm();
    }
  }

  atualizarFormulario() {
    this.form.patchValue({
      id: this.formData.id,
      data: this.formData.data.timestamp,
      categoria: this.formData.categoria,
      descricao: this.formData.descricao,
      fornecedor: this.formData.fornecedor.razao,
      situacao: this.formData.situacao.nome,
      tipo: this.formData.tipo,
      quantidade: this.formData.quantidade,
      valor: this.formData.valor,
      valorTotal: this.formData.valorTotal,
    });
  }

  onSubmit() {
    const formData = {
      ...this.form.value,
      valorTotal: this.form.value.quantidade * this.form.value.valor,
    };

    if (formData.id === null || formData.id === '') {
      this.contatoService.addDocument('transacoes', formData);
      let quantidade = this.quantidade;
      if (formData.tipo === 'despesa') {
        quantidade += formData.quantidade;
      } else {
        quantidade -= formData.quantidade;
      }

      this.contatoService.updateDocument('estoque', formData.peca.id, {
        quantidade: quantidade,
      });
    } else {
      this.contatoService.updateDocument('transacoes', formData.id, formData);
    }
    this.form = this.criarForm();
    this.close.emit();
  }

  createPecaFormGroup(pecaData?: any): FormGroup {
    return this.formBuilder.group({
      descricao: [pecaData ? pecaData.descricao : '', Validators.required],
      valor: [
        pecaData ? pecaData.valor : '',
        [Validators.required, Validators.min(0)],
      ],
      quantidade: [pecaData ? pecaData.quantidade : '', Validators.required],
    });
  }

  addPeca() {
    const pecas = this.form.get('pecas') as FormArray;
    pecas.push(this.createPecaFormGroup());
  }

  onCancel() {
    this.form = this.criarForm();
    this.close.emit();
  }

  selecionouPeca(event: any) {
    this.quantidade = event.value.quantidade;
  }
}
