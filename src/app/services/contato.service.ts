import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, tap } from 'rxjs';
import { Contato } from '../models/contato';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  constructor(private db: AngularFireDatabase) {}

  insert(contato: Contato) {
    this.db
      .list('contato')
      .push(contato)
      .then((result: any) => {
        console.log(result.key);
      });
  }

  update(contato: Contato, key: string) {
    this.db
      .list('contato')
      .update(key, contato)
      .catch((error: any) => {
        console.log(error);
      });
  }

  getAll(): Observable<Contato[]> {
    return this.db
      .list('contato')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...c.payload.exportVal(),
          }));
        }),
        tap(c => console.log(c))
      );
  }

  delete(key: string) {
    this.db.object(`contato/${key}`).remove();
  }

  getByKey(key: string): Observable<any> {
    return this.db.object<any>(`contato/${key}`).valueChanges();
  }


}
