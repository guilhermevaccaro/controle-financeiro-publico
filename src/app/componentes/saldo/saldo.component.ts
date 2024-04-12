import { ReactiveFormsModule } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css'],
})
export class SaldoComponent {
  @Input() titulo!: string;
  @Input() soma!: number;
  @Input() icone!: string;
  @Input() color!: string;
}
