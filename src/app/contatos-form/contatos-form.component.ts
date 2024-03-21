import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContatoService } from '../services/contato.service';
import { ContatoDataService } from '../services/contato-data.service';
import { Contato } from '../models/contato';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contatos-form',
  templateUrl: './contatos-form.component.html',
  styleUrls: ['./contatos-form.component.css'],
})
export class ContatosFormComponent implements OnInit {
  contato: Contato = new Contato(); // Inicialize o contato aqui
  contatosLista!: Observable<Contato[]>; // Ajuste da tipagem aqui
  key: string = '';
  form!: FormGroup;

  constructor(
    private contatoService: ContatoService,
    private contatoDataService: ContatoDataService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: [''],
      telefone: [''],
    });

    this.contatoDataService.currentContato.subscribe((data) => {
      if (data.contato && data.key) {
        console.log('Dados do contato:', data.contato);
        console.log('Chave:', data.key);

        this.contato = data.contato;
        this.key = data.key;

        // Popule o formulário apenas se o contato tiver valores
        if (this.contato && this.contato.nome && this.contato.telefone) {
          this.form.patchValue({
            nome: this.contato.nome,
            telefone: this.contato.telefone,
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.key) {
      console.log('Chave:', this.key); // Verifique a chave antes de chamar o método update
      this.contatoService.update(this.form.value, this.key);
      console.log(this.form.value)
      this.key = '';
      console.log(this.form.value)

    } else {
      // Lógica para inserir o novo contato
      this.contatoService.insert(this.form.value); // Use this.form.value para obter os valores do formulário
    }
    this.form.reset(); // Limpe o formulário após submeter
  }
}
