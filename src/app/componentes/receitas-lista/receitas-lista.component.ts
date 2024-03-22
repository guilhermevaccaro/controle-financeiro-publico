import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceContato: ContatoService
  ) {
    this.carregar();
    // console.log('valor', this.valorSelecionado);
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
    this.serviceContato.getAll().subscribe((dados) => {
      this.contatos = dados.filter((dados) => dados.tipo === 'receita');
    });
  }

  onAdd(tipo: string) {
    this.router.navigate(['new', tipo]);
  }

  onEdit(transacao: any, key: string) {
    this.router.navigate(['edit', key], { state: { transacao: transacao } });
  }

  onRemove(key: string) {
    console.log('key', key);
    this.serviceContato.delete(key);
  }
}
