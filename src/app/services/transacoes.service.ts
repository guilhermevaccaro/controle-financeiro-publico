import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { transacoes } from '../models/transacoes';
import { TransacoesModel } from '../models/TransacoesModel';

@Injectable({
  providedIn: 'root',
})
export class TransacoesService {
  private readonly API = 'http://localhost:3302/api/transacoes';

  constructor(private httpClient: HttpClient) {}

  listarTodasTransacoes(): Observable<any> {
    return this.httpClient
      .get<TransacoesModel>(this.API)
      .pipe(map((res) => res.allTransactions));
  }
  listarTransacaoMes(mes: string): Observable<any> {
    return this.httpClient
      .get<TransacoesModel>(`${this.API}/mes/${mes}`)
      .pipe(map((res) => res.allTransactions));
  }

  listarTodasDespesas(): Observable<any> {
    return this.httpClient
      .get<TransacoesModel>(this.API)
      .pipe(map((res) => res.despesas));
  }
  listarDespesasMes(mes: string): Observable<any> {
    return this.httpClient
      .get<TransacoesModel>(`${this.API}/mes/${mes}`)
      .pipe(map((res) => res.despesas));
  }

  listarTodasReceitas(): Observable<any> {
    return this.httpClient
      .get<TransacoesModel>(this.API)
      .pipe(map((res) => res.receitas));
  }
  listarReceitasMes(mes: string): Observable<any> {
    return this.httpClient
      .get<TransacoesModel>(`${this.API}/mes/${mes}`)
      .pipe(map((res) => res.receitas));
  }

  pesquisarPorId(transacaoId: string) {
    return this.httpClient.get<transacoes>(`${this.API}/${transacaoId}`);
  }

  createDespesa(transacao: transacoes) {
    return this.httpClient.post(this.API, transacao);
  }

  deletarDespesa(transacaoId: string) {
    return this.httpClient.delete(`${this.API}/${transacaoId}`);
  }

  editarDespesa(transacaoId: string, transacao: transacoes) {
    return this.httpClient.put<transacoes>(
      `${this.API}/${transacaoId}`,
      transacao
    );
  }

  getSaldo() {
    return this.httpClient.get('http://localhost:3302/saldo').pipe(
      tap((data) => {
        console.log('Dados recebidos em getSaldo():', data);
      })
    );
  }

  getSaldoMes(mes: string) {
    return this.httpClient.get(`http://localhost:3302/saldo/${mes}`);
  }

  getSaldoPrevistoMes(mes: string) {
    return this.httpClient.get(`http://localhost:3302/saldo/previsto/${mes}`);
  }
}
