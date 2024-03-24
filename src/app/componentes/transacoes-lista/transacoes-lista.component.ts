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

  constructor(private router: Router, private serviceContato: ContatoService) {
    this.carregar();
  }

  ngOnInit(): void {
    console.log('esteira funcionando')
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
        return mes === parseInt(this.valorSelecionado);
      });
      this.contatos = dataFiltrada;
    });
  }

  onAdd(tipo: string) {
    this.router.navigate(['new', tipo]);
  }

  onEdit(transacao: any, id: string) {
    this.router.navigate(['edit', id], { state: { transacao: transacao } });
  }

  onRemove(key: string) {
    this.serviceContato.deleteDocument('transacoes', key);
  }
}
