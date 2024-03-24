import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

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

  addDocument(collectionName: string, data: any): Promise<any> {
    return this.firestore.collection(collectionName).add(data);
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
}
