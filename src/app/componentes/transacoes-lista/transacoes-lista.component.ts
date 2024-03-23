import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';
// import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-transacoes-lista',
  templateUrl: './transacoes-lista.component.html',
  styleUrls: ['./transacoes-lista.component.css'],
})
export class TransacoesListaComponent {
  tipoTransacao: string = '';
  contatos!: Transacao[];
  @Input() valorSelecionado!: string;

  constructor(
    private router: Router,
    private serviceContato: ContatoService,
    // private localStorageService: LocalStorageService
  ) {
    this.carregar();
  }

  ngOnInit(): void {
    // // Restaurar o estado anterior, se disponível
    // const savedMonth = this.localStorageService.getItem('selectedMonth');
    // if (savedMonth) {
    //   this.valorSelecionado = savedMonth;
    // }
  }

  // saveState(): void {
  //   this.localStorageService.setItem('selectedMonth', this.valorSelecionado);
  // }

  ngOnChanges(changes: SimpleChanges) {
    if ('valorSelecionado' in changes) {
      this.carregar();
    }
  }
  carregar() {
    this.serviceContato.getAll().subscribe((items) => {
      const dataFiltrada = items.filter((item) => {
        // Extrai o mês da data (considerando que as datas estão no formato "dd/mm/yyyy")
        const mes = parseInt(item.data.split('/')[1], 10);
        return mes === parseInt(this.valorSelecionado);
      });
      this.contatos = dataFiltrada;
    });
  }

  onAdd(tipo: string) {
    this.router.navigate(['new', tipo]);
    // this.saveState();
  }

  onEdit(transacao: any, key: string) {
    this.router.navigate(['edit', key], { state: { transacao: transacao } });
    // this.saveState();
  }

  onRemove(key: string) {
    this.serviceContato.delete(key);
  }
}
