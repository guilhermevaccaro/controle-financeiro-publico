import { Contato } from '../models/contato';
import { ContatoDataService } from './../services/contato-data.service';
import { ContatoService } from './../services/contato.service';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-contatos-list',
  templateUrl: './contatos-list.component.html',
  styleUrls: ['./contatos-list.component.css'],
})
export class ContatosListComponent {
  contatos!: Observable<any>;

  constructor(
    private contatoService: ContatoService,
    private contatoDataService: ContatoDataService
  ) {
    this.contatos = this.contatoService.getAll();
    this.contatos.subscribe((data) => {
      console.log(data);
      // Aqui você pode ver os dados recebidos do serviço
    });
  }

  delete(key: string) {
    this.contatoService.delete(key)
  }

  edit(contato: Contato, key: string) {
    this.contatoDataService.changeContato(contato, key);
  }
}
