import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Observable, map } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  constructor(private firestore: AngularFirestore) {}

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

  async addDocument(collectionName: string, data: any): Promise<string> {
    // Adiciona o documento à coleção no Firestore
    const docRef = await this.firestore.collection(collectionName).add(data);

    // Obtém o ID do documento adicionado
    const docId = docRef.id;

    // Atribui o ID ao objeto data antes de retorná-lo
    data.id = docId;
    console.log(data);

    return docId; // Retorna apenas o ID, se necessário
  }

  updateDocument(
    collectionName: string,
    docId: string,
    data: any
  ): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).update(data);
  }

  deleteDocument(collectionName: string, docId: string): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }

 getTransacoesPorIntervaloDeDatas(
    dataInicio: Date,
    dataFim: Date
  ): Observable<any[]> {
    // Ajustar dataInicio para o início do dia
    dataInicio.setHours(0, 0, 0, 0);

    // Ajustar dataFim para o final do dia
    dataFim.setHours(23, 59, 59, 999);

    return this.firestore
      .collection<any>('transacoes', (ref) =>
        ref.where('data', '>=', dataInicio).where('data', '<=', dataFim)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map((docs: any[]) => {
          return docs.map((doc) => {
            doc.data = doc.data.toDate();
            return doc;
          });
        })
      );
  }

}
