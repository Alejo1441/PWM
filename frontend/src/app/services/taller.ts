import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore'; // Añadidos collection y getDocs

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
    // Extraemos el ID y los datos de cada taller y los metemos en un Array
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}