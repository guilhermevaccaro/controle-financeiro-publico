import { ContatoService } from './../../services/contato.service';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transacao } from 'src/app/models/Transacao';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
})
export class FormModalComponent {
  form!: FormGroup;
  situacaoLabel: string = 'Pendente';

  @Input() formData!: Transacao;

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
    const formData = this.form.value;
    if (formData.id === null || formData.id === '') {
      // Se o ID for nulo ou vazio, é uma adição
      this.contatoService.addDocument('transacoes', formData);
    } else {
      // Se o ID estiver preenchido, é uma atualização
      this.contatoService.updateDocument('transacoes', formData.id, formData);
    }
    this.form = this.criarForm();
    this.close.emit(); // Emitir evento de fechamento após a submissão
  }

  onCancel() {
    this.form = this.criarForm();
    this.close.emit(); // Emitir evento de fechamento ao cancelar
  }
}
