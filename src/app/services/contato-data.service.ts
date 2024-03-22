import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transacao } from '../models/Transacao';

@Injectable({
  providedIn: 'root',
})
export class ContatoDataService {
  private contatoSource = new BehaviorSubject<{
    contato: Transacao | null;
    key: string;
  }>({ contato: null, key: '' });
  currentContato = this.contatoSource.asObservable();

  constructor() {}

  changeContato(contato: Transacao, key: string) {
    this.contatoSource.next({ contato: contato, key: key });
  }
}
