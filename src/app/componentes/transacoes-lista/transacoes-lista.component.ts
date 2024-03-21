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
  contato!: Contato;

  displayedColumns = [
    'id',
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
    this.contato = new Contato;
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
    // this.service.listarTodasTransacoes().subscribe((res) => {
    //   if (res) {
    //     this.dados = res;
    //   }
    // });
    // this.service.listarTransacaoMes(this.valorSelecionado).subscribe(
    //   (res) => {
    //     if (res) {
    //       this.dados = res;
    //       console.log('Dados recebidos:', res);
    //     } else {
    //       console.log('Resposta vazia ou nula');
    //     }
    //   },
    //   (error) => {
    //     console.error('Ocorreu um erro:', error);
    //   }
    // );
    this.serviceContato.getAll().subscribe((contatos) => {
      this.contatos = contatos;
    });
  }

  onAdd(tipo: string) {
    this.router.navigate(['new', tipo]);
  }

  onEdit(transacao: transacoes) {
    this.router.navigate(['edit', transacao.id]);
  }
  onRemove(transacao: string) {
    this.service.deletarDespesa(transacao).subscribe(
      (response: any) => {
        console.log('Transação deletada com sucesso:', response);
        this.carregar();
        // Lógica adicional após a exclusão da transação, se necessário
      },
      (error: any) => {
        console.error('Erro ao deletar transação:', error);
        // Lógica para lidar com o erro, se necessário
      }
    );
  }

  testaFirebase() {}
}
