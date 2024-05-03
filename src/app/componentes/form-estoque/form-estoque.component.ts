import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/Categoria';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-form-estoque',
  templateUrl: './form-estoque.component.html',
  styleUrls: ['./form-estoque.component.css'],
})
export class FormEstoqueComponent {
  form!: FormGroup;
  situacaoLabel: string = 'Pendente';
  categorias = ['entrada', 'saida'];
  @Input() formData!: any;
  @Input() tipo: string = '';
  @Output() close = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private contatoService: ContatoService
  ) {}

  ngOnInit() {
    this.form = this.criarForm();
  }

  private criarForm() {
    return this.formBuilder.group({
      id: [''],
      codigo: ['', Validators.required],
      fornecedor: ['', Validators.required],
      item: [''],
      quantidade: ['', [Validators.required, Validators.min(0)]],
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
      codigo: this.formData.codigo,
      fornecedor: this.formData.fornecedor,
      item: this.formData.item,
      quantidade: this.formData.quantidade,
    });
  }

  onSubmit() {
    const formData = this.form.value;
    if (formData.id === null || formData.id === '') {
      this.contatoService.addDocument('estoque', formData);
    } else {
      this.contatoService.updateDocument('estoque', formData.id, formData);
    }
    this.form = this.criarForm();
    this.close.emit();
  }

  onCancel() {
    console.log('cancel');
    this.form = this.formBuilder.group({
      id: [''],
      codigo: ['', Validators.required],
      fornecedor: ['', Validators.required],
      item: [''],
      quantidade: ['', [Validators.required, Validators.min(0)]],
    });
    this.close.emit();
  }
}
