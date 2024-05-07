import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

import { ContatoService } from './services/contato.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Controle-Financeiro';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = true;

  formData: any;
  visible: boolean = false;
  visibleEstoque: boolean = false;
  public tipo: string = '';
  public categoria: string = '';

  constructor(
    private observer: BreakpointObserver,
    private serviceContato: ContatoService,
    private config: PrimeNGConfig,
    public router: Router
  ) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
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

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }
  showModalAdd(tipo: string) {
    this.tipo = tipo;
    this.formData = null;
    this.visible = true;
  }

  showModalAddCompraEVenda(tipo: string, categoria: string) {
    this.tipo = tipo;
    this.categoria = categoria;
    this.formData = null;
    this.visibleEstoque = true;
  }
  closeModal() {
    this.visible = false;
    this.visibleEstoque = false;
  }

  onRemove(key: string) {
    this.serviceContato.deleteDocument('transacoes', key);
  }
}
