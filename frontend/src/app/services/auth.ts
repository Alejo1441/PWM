import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la app
})
export class AuthService {
  private auth = inject(Auth);
  private db = inject(Firestore);

  // Método limpio para iniciar sesión
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método que agrupa la creación en Auth y la escritura en Firestore
  async registrarUsuario(datosUsuario: any, password: string) {
    // 1. Crear usuario en Firebase Auth
    const credenciales = await createUserWithEmailAndPassword(this.auth, datosUsuario.email, password);
    const uid = credenciales.user.uid;

    // 2. Guardar los datos extra en Firestore
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