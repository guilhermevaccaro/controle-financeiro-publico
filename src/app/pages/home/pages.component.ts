import { trigger } from '@angular/animations';
import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { Sidebar } from 'primeng/sidebar';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  animations: [trigger('animSlider', [])],
})
export class PagesComponent {
  form!: FormGroup;
  valorSelecionado!: any;
  responsiveOptions: any[] | undefined;
  formData: any;
  visible: boolean = false;
  public tipo: string = '';
  tabIndex = 0;
  activeTab = 0;
  products!: any[];

  somaReceita: any;
  somaDespesa: any;
  contatos!: Transacao[];
  filtro!: string;

  constructor(
    private formBuilder: FormBuilder,
    private config: PrimeNGConfig,
    private serviceContato: ContatoService
  ) {
    this.form = this.formBuilder.group({
      mes: [new Date()],
    });

    this.valorSelecionado = new Date().getMonth() + 1;
  }

  ngOnChanges(changes: SimpleChanges) {}
  onSomaReceitaChanged(valor: number) {
    this.somaReceita = valor;
    // Faça o que for necessário com o valor, como atribuir a uma variável no componente pai
  }
  onSomaDespesaChanged(valor: number) {
    this.somaDespesa = valor;
    console.log(this.somaDespesa);
    // Faça o que for necessário com o valor, como atribuir a uma variável no componente pai
  }

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: Event): void {
    this.sidebarRef.hide();
  }

  sidebarVisible: boolean = false;

  ngOnInit(): void {
    this.config.setTranslation({
      apply: 'Aplicar',
      clear: 'Limpar',
      accept: 'Sim',
      reject: 'Não',
      firstDayOfWeek: 0,
      dayNames: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
      ],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: [
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
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      today: 'Hoje',
    });
  }

  onDateSelect(event: any) {
    const selectedDate: Date = event;
    this.valorSelecionado = selectedDate.getMonth() + 1;
  }

  switchHeaders(tabNumber: any) {
    this.activeTab = tabNumber.index;
  }

  showModal(formData: any) {
    this.formData = formData;
    this.visible = true;
  }

  showModalAdd(tipo: string) {
    this.tipo = tipo;
    this.formData = null;
    this.visible = true;
  }
  public closeModal() {
    this.visible = false;
  }

  onRemove(key: string) {
    this.serviceContato.deleteDocument('transacoes', key);
  }
}
