import { transacoes } from "./transacoes";

export interface TransacoesModel {
  allTransactions: transacoes[],
  despesas: transacoes[],
  receitas: transacoes[],
}
