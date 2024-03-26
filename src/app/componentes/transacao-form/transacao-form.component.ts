import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-transacao-form',
  templateUrl: './transacao-form.component.html',
  styleUrls: ['./transacao-form.component.css'],
})
export class TransacaoFormComponent {
  form: FormGroup;
  transacao: string = '';
  tipo = '';
  contato!: Transacao;
  situacaoLabel: string = 'Pendente';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serviceContato: ContatoService
  ) {
    this.route.params.subscribe((params) => {
      this.tipo = params['tipo'];
    });
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
    this.route.data.subscribe((data) => {
      this.form.patchValue(data['transacao']);
    });
    this.route.params.subscribe((params) => {
      this.tipo = params['tipo'];
      if (this.tipo !== 'receita' && this.tipo !== 'despesa') {
        this.transacao = 'Editando';
      } else this.transacao = 'Adicionando';
    });
  }

  onSubmit() {
    this.route.paramMap.subscribe((params) => {
      const parametroKey = params.get('id');

      if (parametroKey) {
        const contatoToUpdate: any = this.form.value;
        contatoToUpdate.situacao = this.situacaoLabel;

        this.serviceContato.updateDocument(
          'transacoes',
          parametroKey,
          contatoToUpdate
        );
      } else {
        const contatoToInsert: Transacao = this.form.value;
        contatoToInsert.situacao = this.situacaoLabel;
        contatoToInsert.tipo = this.tipo;
        this.serviceContato.addDocument('transacoes', this.form.value);
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
