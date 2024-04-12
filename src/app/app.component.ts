import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { MatSidenav } from '@angular/material/sidenav';
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
  public tipo: string = '';

  constructor(
    private observer: BreakpointObserver,
    private serviceContato: ContatoService
  ) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
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
  closeModal() {
    this.visible = false;
  }

  onRemove(key: string) {
    this.serviceContato.deleteDocument('transacoes', key);
  }
}
