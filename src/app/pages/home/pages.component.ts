import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  animations: [trigger('animSlider', [])],
})
export class PagesComponent {
  form!: FormGroup;
  valorSelecionado!: any;
  mesAtual = this.obterMesAtualString();
  tabIndex = 0;
  activeTab = 0;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      mes: [this.obterMesAtualString()],
    });

    this.valorSelecionado = new Date().getMonth() + 1;
  }

  ngOnInit(): void {
    this.getNomeMes(this.valorSelecionado);
  }

  ngOnChanges() {}

  onDateSelect(event: any) {
    const selectedDate: Date = event;
    this.valorSelecionado = selectedDate.getMonth() + 1;
  }
  getNomeMes(numeroMes: number): string {
    const meses: string[] = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return meses[numeroMes - 1];
  }
  obterMesAtualString(): string {
    const dataAtual = new Date();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    return mes;
  }

  switchHeaders(tabNumber: any) {
    this.activeTab = tabNumber.index;
  }
}
