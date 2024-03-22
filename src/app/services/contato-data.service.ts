import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contato } from '../models/contato';

@Injectable({
  providedIn: 'root',
})
export class ContatoDataService {
  private contatoSource = new BehaviorSubject<{
    contato: Contato | null;
    key: string;
  }>({ contato: null, key: '' });
  currentContato = this.contatoSource.asObservable();

  constructor() {}

  changeContato(contato: Contato, key: string) {
    this.contatoSource.next({ contato: contato, key: key });
  }
}
