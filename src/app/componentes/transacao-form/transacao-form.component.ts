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
  key!: string;

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
    this.route.params.subscribe((params) => {
      this.tipo = params['tipo']; // Obtém o valor do parâmetro 'tipo' da rota

      if (this.tipo !== 'receita' && this.tipo !== 'despesa') {
        this.transacao = 'Editando';
      } else this.transacao = 'Adicionando';
    });

    this.form = this.formBuilder.group({
      nome: [''],
      telefone: [''],
    });
    this.contato = new Contato();
  }
  onSubmit() {
    if (this.key) {
    } else {
      this.serviceContato.insert(this.form.value);
    }
    this.router.navigate(['home']);
  }

  onCancel() {
    this.router.navigate(['home']);
  }
}
