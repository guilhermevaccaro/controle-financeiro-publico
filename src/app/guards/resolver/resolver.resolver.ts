import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Transacao } from 'src/app/models/Transacao';
import { ContatoService } from 'src/app/services/contato.service';

export const courseResolver: ResolveFn<Observable<Transacao>> = (
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
