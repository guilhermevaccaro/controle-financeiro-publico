import { Component } from '@angular/core';
import { TransacoesService } from './services/transacoes.service';
import { FormGroup } from '@angular/forms';
import { ContatoService } from './services/contato.service';
import { ContatoDataService } from './services/contato-data.service';
import { Contato } from './models/contato';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Controle-Financeiro';

}
