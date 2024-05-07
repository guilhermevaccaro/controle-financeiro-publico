import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-form-estoque',
  templateUrl: './form-estoque.component.html',
  styleUrls: ['./form-estoque.component.css'],
})
export class FormEstoqueComponent {
  form!: FormGroup;
  @Input() formData!: any;
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
      item: [''],
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
    this.form.patchValue({
      id: this.formData.id,
      codigo: this.formData.codigo,
      item: this.formData.item,
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
    this.form = this.formBuilder.group({
      id: [''],
      codigo: ['', Validators.required],
      item: [''],
    });
    this.close.emit();
  }
}
