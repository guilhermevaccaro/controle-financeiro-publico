import { ActivatedRoute, Router } from '@angular/router';
import { transacoes } from '../../models/transacoes';
import { TransacoesService } from '../../services/transacoes.service';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { TransacoesModel } from '../../models/TransacoesModel';

@Component({
  selector: 'app-despesa-lista',
  templateUrl: './despesa-lista.component.html',
  styleUrls: ['./despesa-lista.component.css'],
})
export class DespesaListaComponent {
  displayedColumns = [
    'id',
    'descricao',
    'categoria',
    'tipo',
    'valor',
    'data',
    'acoes',
  ];
  dados!: TransacoesModel[];
  @Input() valorSelecionado!: string;

  getCustoTotal() {
    // return this.transacoes.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  constructor(
    private service: TransacoesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
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
    this.service.listarDespesasMes(this.valorSelecionado).subscribe(
      (res) => {
        if (res) {
          this.dados = res;
          console.log('Dados recebidos:', res);
        } else {
          console.log('Resposta vazia ou nula');
        }
      },
      (error) => {
        console.error('Ocorreu um erro:', error);
      }
    );
  }

  onAdd(tipo: string) {
    this.router.navigate(['new', tipo]);
  }
  onEdit(transacao: transacoes) {
    this.router.navigate(['edit', transacao.id]);
  }

  onRemove(transacaoId: string) {
    this.service.deletarDespesa(transacaoId).subscribe(
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
}
