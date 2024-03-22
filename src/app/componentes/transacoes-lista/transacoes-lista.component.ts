import { Component, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransacoesModel } from 'src/app/models/TransacoesModel';
import { transacoes } from 'src/app/models/transacoes';
import { TransacoesService } from 'src/app/services/transacoes.service';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ContatoService } from 'src/app/services/contato.service';
import { Contato } from 'src/app/models/contato';

@Component({
  selector: 'app-transacoes-lista',
  templateUrl: './transacoes-lista.component.html',
  styleUrls: ['./transacoes-lista.component.css'],
})
export class TransacoesListaComponent {
  tipoTransacao: string = '';

  displayedColumns = [
    // 'id',
    'descricao',
    'categoria',
    'tipo',
    'valor',
    'data',
    'acoes',
  ];
  contatos!: Contato[];
  @Input() valorSelecionado!: string;

  constructor(
    private service: TransacoesService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceContato: ContatoService
  ) {
    this.carregar();
    console.log('valor', this.valorSelecionado);
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
    this.serviceContato.getAll().subscribe((contatos) => {
      this.contatos = contatos;
    });
  }

  onAdd(tipo: string) {
    this.router.navigate(['new', tipo]);
  }

  onEdit(transacao: any, key: string) {
    this.router.navigate(['edit', key], { state: { transacao: transacao } });
  }

  onRemove(key: string) {
    console.log('key',key)
    this.serviceContato.delete(key);
  }

  testaFirebase() {}
}
