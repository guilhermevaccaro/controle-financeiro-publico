import { transacoes } from './../../models/transacoes';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contato } from 'src/app/models/contato';
import { ContatoDataService } from 'src/app/services/contato-data.service';
import { ContatoService } from 'src/app/services/contato.service';
import { TransacoesService } from 'src/app/services/transacoes.service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-transacao-form',
  templateUrl: './transacao-form.component.html',
  styleUrls: ['./transacao-form.component.css'],
})
export class TransacaoFormComponent {
  form: FormGroup;
  transacao: string = '';
  tipo: string = ''; // Aqui obtemos o valor do parâmetro 'tipo' da rota
  data = new Date();
  contato: Contato | null = null; // Defina o tipo de contato
  key: string | null = null;
  dataSelecionada!: Date;
  dataSelecionadaString!: string;
  categorias: any[] | undefined;
  situacaoLabel: string = 'Pendente'; // Inicialmente é definido como 'Pendente'

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder,
    private service: TransacoesService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceContato: ContatoService,
    private serviceContatoData: ContatoDataService
  ) {
    this.route.params.subscribe((params) => {
      this.tipo = params['tipo']; // Obtém o valor do parâmetro 'tipo' da rota
    });
    this.dateAdapter.setLocale('pt-BR');
    this.form = this.formBuilder.group({
      categoria: ['', Validators.required],
      data: ['', Validators.required],
      descricao: ['', Validators.required],
      situacao: [''],
      tipo: [''],
      valor: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.categorias = ['New York', 'Rome', 'London', 'Istanbul', 'Paris'];
    // console.log(this.route.snapshot.paramMap.get('key'));
    this.route.data.subscribe((data) => {
      // console.log(data['transacao']);
      this.form.patchValue(data['transacao']); // ou use setValue se quiser substituir todos os campos
      // Aqui você terá acesso aos dados resolvidos
    });
    this.contato = new Contato();
    this.route.params.subscribe((params) => {
      this.tipo = params['tipo']; // Obtém o valor do parâmetro 'tipo' da rota

      if (this.tipo !== 'receita' && this.tipo !== 'despesa') {
        this.transacao = 'Editando';
      } else this.transacao = 'Adicionando';
    });

    this.serviceContatoData.currentContato.subscribe((data) => {
      // console.log(data);
      if (data && data.key) {
        // Verifique se data e data.key existem
        this.key = data.key; // Atribua a chave de data a this.key
        this.form.patchValue(data); // Preencha o formulário com os dados do contato
      }
    });
    // console.log(this.form.value);
  }

  onSubmit() {
    this.route.paramMap.subscribe((params) => {
      const parametroKey = params.get('key');

      if (parametroKey) {
        // Extraia os valores do FormGroup
        const contatoToUpdate: Contato = this.form.value;
        contatoToUpdate.situacao = this.situacaoLabel; // Adicione a palavra do switch ao objeto contatoToInsert
        // console.log('contato atualizado:', contatoToUpdate);
        this.serviceContato.update(contatoToUpdate, parametroKey);
      } else {
        const contatoToInsert: Contato = this.form.value;
        contatoToInsert.situacao = this.situacaoLabel; // Adicione a palavra do switch ao objeto contatoToInsert
        contatoToInsert.tipo = this.tipo; // Adicione a palavra do switch ao objeto contatoToInsert
        this.serviceContato.insert(this.form.value);

        // console.log(this.form.value);
      }
      this.router.navigate(['home']);
    });
  }

  onCancel() {
    this.router.navigate(['home']);
  }

  atualizarLabel() {
    this.situacaoLabel = this.form.value.situacao ? 'Efetivado' : 'Pendente';
  }
}
