import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { transacoes } from 'src/app/models/transacoes';
import { ContatoService } from 'src/app/services/contato.service';
import { TransacoesService } from 'src/app/services/transacoes.service';

export const courseResolver: ResolveFn<Observable<transacoes>> = (
  route,
  state,
  service: ContatoService = inject(ContatoService)
) => {
  if (route.params?.['key']) {
    return service.getByKey(route.params['key']);
  }
  return of({
    id: '',
    descricao: '',
    categoria: '',
    data: '',
    tipo: '',
    valor: '',
    situacao: '',
  });
};
