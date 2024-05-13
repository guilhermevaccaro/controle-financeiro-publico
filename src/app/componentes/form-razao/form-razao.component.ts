import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-form-razao',
  templateUrl: './form-razao.component.html',
  styleUrls: ['./form-razao.component.css'],
})
export class FormRazaoComponent {
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
      nome: ['', Validators.required],
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
      nome: this.formData.fornecedor,
    });
  }

  onSubmit() {
    const formData = this.form.value;
    if (formData.id === null || formData.id === '') {
      this.contatoService.addDocument('fornecedor', formData);
    } else {
      this.contatoService.updateDocument('fornecedor', formData.id, formData);
    }
    this.form = this.criarForm();
    this.close.emit();
  }

  onCancel() {
    this.form = this.formBuilder.group({
      id: [''],
      nome: [''],
    });
    this.close.emit();
  }
}
