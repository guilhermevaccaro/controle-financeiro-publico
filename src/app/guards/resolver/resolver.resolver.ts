import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { transacoes } from 'src/app/models/transacoes';
import { TransacoesService } from 'src/app/services/transacoes.service';

export const courseResolver: ResolveFn<Observable<transacoes>> = (route, state, service: TransacoesService = inject(TransacoesService)) => {

  if (route.params?.['id']) {
    return service.pesquisarPorId(route.params['id']);
  }
  return of({ id: '', descricao: '', categoria: '', data: new Date(), tipo: '', valor: 0, situacao: false });
};
