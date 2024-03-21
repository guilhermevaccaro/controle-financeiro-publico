import { Component } from '@angular/core';
import { TransacoesService } from './services/transacoes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Controle-Financeiro';

  constructor(private service: TransacoesService) {

  }


}
