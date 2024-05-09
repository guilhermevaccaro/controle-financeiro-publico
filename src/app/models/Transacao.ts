export interface Transacao {
  id: string;
  categoria: string;
  data: string;
  descricao: string;
  situacao: boolean;
  tipo: string;
  valor: number;
  valorTotal: number;
}
