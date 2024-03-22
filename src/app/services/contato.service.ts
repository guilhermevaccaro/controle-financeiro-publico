import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, tap } from 'rxjs';
import { Transacao } from '../models/Transacao';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  constructor(private db: AngularFireDatabase) {}

  insert(transacao: Transacao) {
    this.db.list('transacoes').push(transacao);
  }

  update(transacao: Transacao, key: string) {
    this.db
      .list('transacoes')
      .update(key, transacao)
      .catch((error: any) => {
        console.log(error);
      });
  }

  getAll(): Observable<Transacao[]> {
    return this.db
      .list('transacoes')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...c.payload.exportVal(),
          }));
        })
      );
  }

  delete(key: string) {
    this.db.object(`transacoes/${key}`).remove();
  }

  getByKey(key: string): Observable<any> {
    return this.db.object<any>(`transacoes/${key}`).valueChanges();
  }
}
