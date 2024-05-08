import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transacao } from 'src/app/models/Transacao';

import { ContatoService } from './../../services/contato.service';
import { Categoria } from 'src/app/models/Categoria';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
})
export class FormModalComponent {
  form!: FormGroup;
  situacaoLabel: string = 'Pendente';
  categorias!: Categoria[];
  categoriasSubscription!: Subscription;

  @Input() formData!: Transacao;
  @Input() tipo: string = '';
  @Input() categoria: string = '';
  @Output() close = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private contatoService: ContatoService
  ) {}

  ngOnInit() {
    this.form = this.criarForm();
    this.categoriasSubscription = this.contatoService
      .getCollection('categorias')
      .subscribe((items) => {
        this.categorias = [];
        items.forEach((item) => {
          this.categorias.push(item.nomeCategoria);
        });
      });
  }

  private criarForm() {
    return this.formBuilder.group({
      id: [''],
      categoria: [this.categoria, Validators.required],
      data: ['', Validators.required],
      descricao: ['', Validators.required],
      situacao: [''],
      tipo: [this.tipo],
      valor: ['', [Validators.required, Validators.min(0)]],
      quantidade: [1],
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

  onSubmit() {
    const formData = this.form.value;
    const valorTotal = this.form.value.quantidade * this.form.value.valor;
    formData.valorTotal = valorTotal; // Adicionar o valor total aos dados do formulário

    if (formData.id === null || formData.id === '') {
      this.contatoService.addDocument('transacoes', formData);
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
}
