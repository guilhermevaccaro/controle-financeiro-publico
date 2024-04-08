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
      categoria: ['', Validators.required],
      data: ['', Validators.required],
      descricao: ['', Validators.required],
      situacao: [''],
      tipo: [this.tipo],
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
    console.log(this.form.value);
    const formData = this.form.value;
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
