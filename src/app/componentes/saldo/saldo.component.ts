import { Component, Input, SimpleChanges } from '@angular/core';
import { TransacoesService } from 'src/app/services/transacoes.service';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css'],
})
export class SaldoComponent {
  saldoPrevisto = 0;
  saldoMes = 0;
  @Input() mes!: string;

  constructor(private service: TransacoesService) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('mes' in changes) {
      this.carregar();
    }
  }

  carregar() {
    this.carregarSaldoMes();
    this.carregarSaldoPrevistoMes();
  }

  carregarSaldoPrevistoMes(): void {
    this.service.getSaldoPrevistoMes(this.mes).subscribe(
      (data: any) => {
        this.saldoPrevisto = data.saldoPrevisto;
        console.log('saldo', this.saldoPrevisto);
      },
      (error) => {
        console.error('Erro ao carregar saldo:', error);
      }
    );
  }

  carregarSaldoMes() {
    this.service.getSaldoMes(this.mes).subscribe(
      (data: any) => {
        this.saldoMes = data.saldo;
        console.log(this.saldoMes);
      },
      (error) => {
        console.error('Erro ao carregar saldo:', error);
      }
    );
  }
}
