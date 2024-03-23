import { trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DespesaListaComponent } from '../../componentes/depesa/despesa-lista.component';
import { ReceitasListaComponent } from '../../componentes/receitas-lista/receitas-lista.component';
import { TransacoesListaComponent } from '../../componentes/transacoes-lista/transacoes-lista.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  animations: [trigger('animSlider', [])],
})
export class PagesComponent {
  form!: FormGroup;
  valorSelecionado!: string;

  @ViewChild(TransacoesListaComponent)
  transacoesLista!: TransacoesListaComponent;
  @ViewChild(DespesaListaComponent)
  despesaLista!: DespesaListaComponent;
  @ViewChild(ReceitasListaComponent)
  receitasLista!: ReceitasListaComponent;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.form = this.formBuilder.group({
      mes: [''],
    });
  }

  ngOnInit(): void {
    // Restaurar o estado anterior, se disponível
    const savedMonth = this.localStorageService.getItem('selectedMonth');
    if (savedMonth) {
      this.valorSelecionado = savedMonth;
    }
  }
  saveState(): void {
    this.localStorageService.setItem('selectedMonth', this.valorSelecionado);
  }

  ngOnChanges() {
    this.saveState();
  }

  counter: number = 0;
  list: { name: string; value: string }[] = [
    { name: 'Janeiro', value: '1' },
    { name: 'Fevereiro', value: '2' },
    { name: 'Março', value: '3' },
    { name: 'Abril', value: '4' },
    { name: 'Maio', value: '5' },
    { name: 'Junho', value: '6' },
    { name: 'Julho', value: '7' },
    { name: 'Agosto', value: '8' },
    { name: 'Setembro', value: '9' },
    { name: 'Outubro', value: '10' },
    { name: 'Novembro', value: '11' },
    { name: 'Dezembro', value: '12' },
  ];

  onNext() {
    if (this.counter != this.list.length - 1) {
      this.counter++;
      this.valorSelecionado = this.list[this.counter].value;
    }
  }

  onPrevious() {
    if (this.counter > 0) {
      this.counter--;
      this.valorSelecionado = this.list[this.counter].value;
    }
  }

  updateSelectedValue(selectedValue: string): void {
    this.valorSelecionado = selectedValue;
    this.saveState(); // Salve o estado sempre que houver uma mudança
  }
}
