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

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      mes: [this.obterMesAtualString()],
    });

    // Inicializando valorSelecionado com o mês atual
    this.valorSelecionado = new Date().getMonth() + 1;
  }

  ngOnInit(): void {
    this.getNomeMes(this.valorSelecionado);
  }

  ngOnChanges() {}

  onDateSelect(event: any) {
    const selectedDate: Date = event;
    this.valorSelecionado = selectedDate.getMonth() + 1; // Adiciona +1 porque os meses em JavaScript são zero-indexados
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
    return meses[numeroMes - 1]; // Subtrai -1 porque os meses são zero-indexados
  }
  obterMesAtualString(): string {
    const dataAtual = new Date();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se o mês for menor que 10
    return mes;
  }

  // counter: number = 0;
  // list: { name: string; value: string }[] = [
  //   { name: 'Janeiro', value: '1' },
  //   { name: 'Fevereiro', value: '2' },
  //   { name: 'Março', value: '3' },
  //   { name: 'Abril', value: '4' },
  //   { name: 'Maio', value: '5' },
  //   { name: 'Junho', value: '6' },
  //   { name: 'Julho', value: '7' },
  //   { name: 'Agosto', value: '8' },
  //   { name: 'Setembro', value: '9' },
  //   { name: 'Outubro', value: '10' },
  //   { name: 'Novembro', value: '11' },
  //   { name: 'Dezembro', value: '12' },
  // ];

  // onNext() {
  //   if (this.counter != this.list.length - 1) {
  //     this.counter++;
  //     this.valorSelecionado = this.list[this.counter].value;
  //   }
  // }

  // onPrevious() {
  //   if (this.counter > 0) {
  //     this.counter--;
  //     this.valorSelecionado = this.list[this.counter].value;
  //   }
  // }

  // updateSelectedValue(selectedValue: string): void {
  //   this.valorSelecionado = selectedValue;
  // }
}
