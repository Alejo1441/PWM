import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private db = inject(Firestore);

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }


  async registrarUsuario(datosUsuario: any, password: string) {

    const credenciales = await createUserWithEmailAndPassword(this.auth, datosUsuario.email, password);
    const uid = credenciales.user.uid;

    const userRef = doc(this.db, 'usuarios', uid);
    await setDoc(userRef, {
      nombre: datosUsuario.nombre,
      apellido: datosUsuario.apellido,
      email: datosUsuario.email,
      municipio: datosUsuario.municipio,
      rol: 'cliente',
      fechaRegistro: new Date()
    });

    return credenciales;
  }
}