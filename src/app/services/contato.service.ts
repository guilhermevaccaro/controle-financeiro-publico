import { Injectable } from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  constructor(
    private firestore: AngularFirestore
  ) {}

  // insert(transacao: Transacao) {
  //   this.db.list('transacoes').push(transacao);
  // }

  // update(transacao: Transacao, key: string) {
  //   this.db
  //     .list('transacoes')
  //     .update(key, transacao)
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // }

  // getAll(): Observable<Transacao[]> {
  //   return this.db
  //     .list('transacoes')
  //     .snapshotChanges()
  //     .pipe(
  //       map((changes) => {
  //         return changes.map((c) => ({
  //           key: c.payload.key,
  //           ...c.payload.exportVal(),
  //         }));
  //       })
  //     );
  // }

  // delete(key: string) {
  //   this.db.object(`transacoes/${key}`).remove();
  // }

  // getByKey(key: string): Observable<any> {
  //   return this.db.object<any>(`transacoes/${key}`).valueChanges();
  // }

  getCollection(collectionName: string): Observable<any[]> {
    return this.firestore
      .collection(collectionName)
      .valueChanges({ idField: 'id' });
  }
  getDocumentById(collectionName: string, documentId: string): Observable<any> {
    return this.firestore
      .collection(collectionName)
      .doc(documentId)
      .valueChanges();
  }

  // Método para adicionar um documento a uma coleção do Firestore
  addDocument(collectionName: string, data: any): Promise<any> {
    return this.firestore.collection(collectionName).add(data);
  }

  // Método para atualizar um documento existente no Firestore
  updateDocument(
    collectionName: string,
    docId: string,
    data: any
  ): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).update(data);
  }

  // Método para excluir um documento do Firestore
  deleteDocument(collectionName: string, docId: string): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }
}
