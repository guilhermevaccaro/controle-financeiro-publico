/* eslint-disable no-prototype-builtins */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { Item, Peca, Pedido } from 'src/app/models/Pedido';
import { ContatoService } from 'src/app/services/contato.service';

interface ItemEstoque {
  item: string;
  quantidade: number;
  id: string;
}

interface Situacao {
  nome: string;
}

@Component({
  selector: 'app-form-adicionar-remover-estoque',
  templateUrl: './form-adicionar-remover-estoque.component.html',
  styleUrls: ['./form-adicionar-remover-estoque.component.css'],
})
export class FormAdicionarRemoverEstoqueComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() formData!: Pedido | null;
  @Input() tipo = '';
  @Input() categoria = '';
  @Output() closeModal = new EventEmitter<void>();

  form!: FormGroup;
  estoque: ItemEstoque[] = [];
  nome: ItemEstoque[] = [];
  situacaoOpcoes: Situacao[] = [{ nome: 'Pendente' }, { nome: 'Efetivado' }];
  quantidade = 0;
  idPeca!: string;
  valorTotal = 0;
  valorTotalPorPeca = 0;

  private estoqueSubscription!: Subscription;
  private razaoSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private contatoService: ContatoService
  ) {}

  ngOnInit() {
    this.form = this.createForm();
    this.loadEstoque();
    this.loadFornecedores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.updateForm();
    }
    if (changes['tipo'] && !changes['tipo'].firstChange) {
      this.form.get('tipo')?.setValue(this.tipo);
    }
    if (changes['categoria'] && !changes['categoria'].firstChange) {
      this.form.get('categoria')?.setValue(this.categoria);
    }
  }

  ngOnDestroy() {
    if (this.estoqueSubscription) {
      this.estoqueSubscription.unsubscribe();
    }
    if (this.razaoSubscription) {
      this.razaoSubscription.unsubscribe();
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      codigoPedido: [''],
      data: [new Date(), Validators.required],
      categoria: [this.categoria],
      descricao: ['', Validators.required],
      pecas: this.formBuilder.array([]),
      fornecedor: ['', Validators.required],
      situacao: ['', Validators.required],
      tipo: [this.tipo],
      valorTotal: [this.valorTotal],
    });
  }

  private createPecaFormGroup(
    item: Item,
    peca: Peca = {
      idPeca: '',
      item: item,
      quantidadeAdicionada: 0,
      valorUnitario: 0,
    }
  ): FormGroup {
    return this.formBuilder.group({
      idPeca: [peca.idPeca],
      item: [peca.item, Validators.required],
      quantidadeAdicionada: [peca.quantidadeAdicionada, Validators.required],
      valorUnitario: [peca.valorUnitario, Validators.required],
    });
  }

  private loadEstoque() {
    this.estoqueSubscription = this.contatoService
      .getCollection('estoque')
      .subscribe({
        next: (items) => (this.estoque = items),
        error: (err) => console.error('Error loading estoque', err),
      });
  }

  private loadFornecedores() {
    this.razaoSubscription = this.contatoService
      .getCollection('fornecedor')
      .subscribe({
        next: (items) => (this.nome = items),
        error: (err) => console.error('Error loading fornecedores', err),
      });
  }

  addPeca(item: Item) {
    const pecas = this.form.get('pecas') as FormArray;
    pecas.push(this.createPecaFormGroup(item));
  }

  removerPeca(index: number) {
    const pecas = this.form.get('pecas') as FormArray;
    pecas.removeAt(index);
  }

  getPecasFormArray() {
    return (<UntypedFormArray>this.form.get('pecas')).controls;
  }

  private updateForm() {
    const transacao = this.formData;
    this.form.patchValue({
      id: transacao?.id,
      data: transacao?.data,
      categoria: transacao?.categoria,
      descricao: transacao?.descricao,
      fornecedor: transacao?.fornecedor,
      situacao: transacao?.situacao,
      tipo: transacao?.tipo,
      valorTotal: transacao?.valorTotal,
    });

    this.form.setControl(
      'pecas',
      this.formBuilder.array(
        transacao?.pecas?.map((peca: Peca) =>
          this.createPecaFormGroup(peca.item)
        ) || []
      )
    );
  }

  onSubmit() {
    const formData = {
      ...this.form.value,
      valorTotal: this.calcularValorTotal(this.form.value),
    };

    if (!formData.id) {
      this.contatoService
        .addDocument('transacoes', formData)
        .then(() => {
          this.updateEstoque(formData);
          this.resetForm();
        })
        .catch((err) => console.error('Error adding transacao', err));
    } else {
      this.contatoService
        .updateDocument('transacoes', formData.id, formData)
        .then(() => {
          this.resetForm();
        })
        .catch((err) => console.error('Error updating transacao', err));
    }
  }

  onCancel() {
    this.resetForm();
  }

  private resetForm() {
    this.form.reset();
    this.form = this.createForm();
    this.closeModal.emit();
  }

  selecionouPeca(event: DropdownChangeEvent, index: number) {
    const pecas = this.form.get('pecas') as FormArray;
    const pecaGroup = pecas.at(index) as FormGroup;
    pecaGroup.patchValue({
      idPeca: event.value.id,
      nome: event.value.nome,
    });
  }

  private updateEstoque(formData: Pedido) {
    for (const peca of formData.pecas) {
      const quantidade =
        formData.tipo === 'receita'
          ? peca.item.quantidade - peca.quantidadeAdicionada
          : peca.quantidadeAdicionada + peca.item.quantidade;
      this.contatoService
        .updateDocument('estoque', peca.idPeca, { quantidade: quantidade })
        .catch((err) => console.error('Error updating estoque', err));
    }
  }

  private calcularValorTotal(formData: Pedido): number {
    let valorTotal = 0;

    const pecas = formData.pecas;
    for (const peca of pecas) {
      const valorTotalPorPeca = peca.quantidadeAdicionada * peca.valorUnitario;
      valorTotal += valorTotalPorPeca;
    }

    if (formData.tipo === 'despesa') {
      return -valorTotal;
    }

    return valorTotal;
  }
}
