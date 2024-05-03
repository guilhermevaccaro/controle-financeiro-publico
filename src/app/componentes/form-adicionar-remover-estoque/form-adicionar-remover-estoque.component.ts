import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

interface ItemEstoque {
  codigo: string;
  fornecedor: string;
  id: string;
  produto: string;
  preco: number;
  quantidade: number;
}

@Component({
  selector: 'app-form-adicionar-remover-estoque',
  templateUrl: './form-adicionar-remover-estoque.component.html',
  styleUrls: ['./form-adicionar-remover-estoque.component.css'],
})
export class FormAdicionarRemoverEstoqueComponent {
  form!: FormGroup;
  situacaoLabel: string = 'Pendente';
  categorias = ['entrada', 'saida'];
  formulario!: any;
  @Input() produtos: ItemEstoque[] | undefined;
  @Input() contatos: ItemEstoque[] = [];
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
      data: [''],
      categoria: [''],
      codigo: ['', Validators.required],
      fornecedor: ['', Validators.required],
      produto: [''],
      quantidade: ['', [Validators.required, Validators.min(0)]],
      adicionar: ['', [Validators.required, Validators.min(0)]],
      preco: ['', [Validators.required, Validators.min(0)]],
    });
  }
  onProdutoChange($event: DropdownChangeEvent) {
    this.formulario = $event.value;
    console.log(this.formulario.produto);
    this.form.patchValue({
      id: this.formulario.id,
      data: this.formulario.data,
      codigo: this.formulario.codigo,
      produto: this.formulario.produto,
      fornecedor: this.formulario.fornecedor,
      quantidade: this.formulario.quantidade,
      preco: this.formulario.preco,
    });
  }

  carregaItensEstoque() {
    if (this.contatos) {
      this.produtos = [];
      this.contatos.forEach((item) => {
        this.produtos?.push(item); // Adiciona os produtos do item atual ao array this.produtos
      });
    }
  }

  ngOnChanges() {
    this.carregaItensEstoque();
  }

  onSubmit() {
    const formData = this.form.value;
    if (formData.categoria === 'entrada') {
      formData.quantidade = formData.quantidade + formData.adicionar;
    } else {
      formData.quantidade = formData.quantidade - formData.adicionar;
    }

    this.contatoService.updateDocument('estoque', formData.id, formData);

    const formDataMovimentacao = this.form.value;

    this.contatoService.addDocument('movimentacao', formDataMovimentacao);

    this.form = this.criarForm();
    this.close.emit();
  }

  onCancel() {
    this.form = this.criarForm();
    this.close.emit();
  }
}
