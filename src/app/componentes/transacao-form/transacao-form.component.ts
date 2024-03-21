import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contato } from 'src/app/models/contato';
import { transacoes } from 'src/app/models/transacoes';
import { ContatoService } from 'src/app/services/contato.service';
import { TransacoesService } from 'src/app/services/transacoes.service';

@Component({
  selector: 'app-transacao-form',
  templateUrl: './transacao-form.component.html',
  styleUrls: ['./transacao-form.component.css'],
})
export class TransacaoFormComponent {
  form!: FormGroup;
  transacao: string = '';
  tipo: string = ''; // Aqui obtemos o valor do parâmetro 'tipo' da rota
  data = new Date();
  contato!: any;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder,
    private service: TransacoesService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceContato: ContatoService
  ) {
    this.dateAdapter.setLocale('pt-BR');
  }
  ngOnInit() {
    this.inicializaForm();

    this.route.params.subscribe((params) => {
      this.tipo = params['tipo']; // Obtém o valor do parâmetro 'tipo' da rota

      if (this.tipo !== 'receita' && this.tipo !== 'despesa') {
        this.transacao = 'Editando';
      } else this.transacao = 'Adicionando';
    });
  }
  onSubmit() {
    const novaTransacao = this.form.value;

    this.criarNovaTransação(novaTransacao);
  }

  onCancel() {
    this.router.navigate(['home']);
  }

  criarNovaTransação(contato: Contato) {
    this.serviceContato.insert(this.contato);
  }
  editarTransação(novaTransacao: any) {
    this.service.editarDespesa(novaTransacao.id, novaTransacao).subscribe(
      (response) => {
        console.log('Transação atualizada com sucesso:', novaTransacao);
        // Lógica adicional após a criação da transação, se necessário
        this.router.navigate(['home']);
      },
      (error) => {
        console.error('Erro ao criar transação:', error);
        // Lógica para lidar com o erro, se necessário
        console.log(novaTransacao);
      }
    );
  }

  formatandoData() {
    const novaTransacao = this.form.value; // Extrai os valores do formulário
    const dataForm = novaTransacao.data;
    const dataFormatada = new Date(dataForm).toISOString().split('T')[0];
    return dataFormatada;
  }

  inicializaForm() {
    this.route.url.subscribe((urlSegments) => {
      const ultimaParteUrl = urlSegments[urlSegments.length - 2].path;
      if (ultimaParteUrl === 'edit') {
        const transacao: transacoes[] = this.route.snapshot.data['transacao'];
        this.form = this.formBuilder.group({
          id: [transacao[0].id],
          descricao: [transacao[0].descricao],
          categoria: [transacao[0].categoria],
          data: [transacao[0].data],
          valor: [transacao[0].valor],
          tipo: [transacao[0].tipo],
          situacao: [transacao[0].situacao],
        });
        console.log(transacao[0].tipo);
      } else if (ultimaParteUrl === 'new') {
        const penultimaParteUrl = urlSegments[urlSegments.length - 1].path;
        console.log(penultimaParteUrl);
        this.form = this.formBuilder.group({
          id: [''],
          descricao: [''],
          categoria: [''],
          data: [new Date()],
          valor: [''],
          tipo: [penultimaParteUrl],
          situacao: [''],
        });
      }
    });
  }
}
