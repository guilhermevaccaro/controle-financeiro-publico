import { Component, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransacoesModel } from 'src/app/models/TransacoesModel';
import { transacoes } from 'src/app/models/transacoes';
import { TransacoesService } from 'src/app/services/transacoes.service';

@Component({
  selector: 'app-receitas-lista',
  templateUrl: './receitas-lista.component.html',
  styleUrls: ['./receitas-lista.component.css'],
})
export class ReceitasListaComponent {
  displayedColumns = ['descricao', 'categoria', 'valor', 'data', 'acoes'];
  dados!: TransacoesModel[];
  @Input() valorSelecionado!: string;


  constructor(
    private service: TransacoesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.carregar();
  }

  handleTabChange() {
    // this.carregar();
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('valorSelecionado' in changes) {
      // this.carregar()
    }
  }

  carregar() {
    this.service.listarReceitasMes(this.valorSelecionado).subscribe(
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
