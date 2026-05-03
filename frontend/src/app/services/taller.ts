import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TallerService {
  private db = inject(Firestore);


  async getTallerById(id: string) {
    const docRef = doc(this.db, 'talleres', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  }

  async getAllTalleres() {
    const talleresRef = collection(this.db, 'talleres');
    const querySnapshot = await getDocs(talleresRef);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}