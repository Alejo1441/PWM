import { Injectable, inject, EnvironmentInjector, runInInjectionContext} from '@angular/core';
import { Firestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db = inject(Firestore);
  private injector = inject(EnvironmentInjector);




  listenUser(uid: string, callback: (data: any) => void) {
    return onSnapshot(doc(this.db, 'usuarios', uid), (snapshot) => {
      callback(snapshot.data());
    });
  }


  async getUserOnce(uid: string) {
    const docRef = doc(this.db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async updateUser(uid: string, nombre: string, apellido: string, municipio: string){
    const userRef = doc(this.db, `usuarios/${uid}`);
    const userUpdate = { nombre: nombre, apellido: apellido, municipio: municipio };
    return await updateDoc(userRef, userUpdate);
  }

  async addVehiculo(uid: string, vehiculoTexto: string) {
    return updateDoc(doc(this.db, 'usuarios', uid), {
      vehiculos: arrayUnion(vehiculoTexto)
    });
  }

  async removeVehiculo(uid: string, vehiculoTexto: string) {
    return updateDoc(doc(this.db, 'usuarios', uid), {
      vehiculos: arrayRemove(vehiculoTexto)
    });
  }
  async addReserva(uid: string, reservaObj: any) {
    return updateDoc(doc(this.db, 'usuarios', uid), {
      reservas: arrayUnion(reservaObj)
    });
  }

  async removeReserva(uid: string, reservaObj: any) {
    return updateDoc(doc(this.db, 'usuarios', uid), {
      reservas: arrayRemove(reservaObj)
    });
  }


}
