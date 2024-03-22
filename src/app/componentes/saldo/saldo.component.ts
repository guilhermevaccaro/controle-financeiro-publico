import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css'],
})
export class SaldoComponent {
  saldoPrevisto = 0;
  saldoMes = 0;
  @Input() mes!: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if ('mes' in changes) {
      this.carregar();
    }
  }

  carregar() {
    // this.carregarSaldoMes();
    // this.carregarSaldoPrevistoMes();
  }

  carregarSaldoPrevistoMes(): void {}

  carregarSaldoMes() {}
}
