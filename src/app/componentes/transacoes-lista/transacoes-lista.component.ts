import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-transacoes-lista',
  templateUrl: './transacoes-lista.component.html',
  styleUrls: ['./transacoes-lista.component.css'],
})
export class TransacoesListaComponent {
  tipoTransacao: string = '';
  contatos!: Transacao[];
  @Input() valorSelecionado!: string;
  @Input() filtro!: string;
  visible: boolean = false;
  public tipo: string = '';
  formData: any;

  constructor(private router: Router, private serviceContato: ContatoService) {
    this.carregar();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('valorSelecionado' in changes) {
      this.carregar();
    }
  }
  carregar() {
    this.serviceContato.getCollection('transacoes').subscribe((items) => {
      const dataFiltrada = items.filter((item) => {
        const mes = parseInt(item.data.split('/')[1], 10);
        return (
          mes === parseInt(this.valorSelecionado) &&
          (this.filtro != '' ? item.tipo === this.filtro : true)
        );
      });
      this.contatos = dataFiltrada;
    });
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

  onRemove(key: string) {
    this.serviceContato.deleteDocument('transacoes', key);
  }

  public closeModal() {
    this.visible = false;
  }
}
