import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-receitas-lista',
  templateUrl: './receitas-lista.component.html',
  styleUrls: ['./receitas-lista.component.css'],
})
export class ReceitasListaComponent {
  tipoTransacao: string = '';
  contatos!: Transacao[];
  @Input() valorSelecionado!: string;

  constructor(private router: Router, private serviceContato: ContatoService) {
    this.carregar();
  }
  handleTabChange() {
    this.carregar();
  }

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
          mes === parseInt(this.valorSelecionado) && item.tipo === 'receita'
        );
      });
      this.contatos = dataFiltrada;
    });
  }

  onAdd(tipo: string) {
    this.router.navigate(['new', tipo]);
  }

  onEdit(transacao: any, key: string) {
    this.router.navigate(['edit', key], { state: { transacao: transacao } });
  }

  onRemove(key: string) {
    this.serviceContato.deleteDocument('transacoes', key);
  }
}
