import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router'; // <-- 1. Importamos el Router


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login{
  // Inyectamos los servicios
  private auth = inject(Auth);
  private db = inject(Firestore);
  private router = inject(Router); // <-- 2. Inyectamos el Router en la clase

  isLoginMode = true;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  registerForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    municipio: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', Validators.required)
  });

  toggleMode(modoLogin: boolean) {
    this.isLoginMode = modoLogin;
  }

  // --- FUNCIÓN DE LOGIN REAL ---
  async enviarLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;

      try {
        const credenciales = await signInWithEmailAndPassword(this.auth, email, password);
        console.log('¡Login exitoso!', credenciales.user.email);

        // 3. Redirigimos al perfil tras el éxito
        this.router.navigate(['/profile']);

      } catch (error: any) {
        console.error('Error al iniciar sesión:', error.message);
        alert('Error: Correo o contraseña incorrectos');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // --- FUNCIÓN DE REGISTRO REAL ---
  async enviarRegistro() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      const { email, password, nombre, apellido, municipio } = this.registerForm.value;

      try {
        // 1. Creamos el usuario en Authentication (Esto auto-inicia la sesión)
        const credenciales = await createUserWithEmailAndPassword(this.auth, email!, password!);
        const uid = credenciales.user.uid;

        // 2. Creamos su ficha en la base de datos Firestore
        await setDoc(doc(this.db, 'usuarios', uid), {
          nombre: nombre,
          apellido: apellido,
          email: email,
          municipio: municipio,
          rol: 'cliente', // Por defecto todos son clientes
          fechaRegistro: new Date()
        });

        console.log('¡Usuario y Perfil creados!');
        alert('Cuenta creada con éxito. ¡Bienvenido!');

        // 3. Como ya está logueado automáticamente, lo mandamos al perfil
        this.router.navigate(['/profile']);

      } catch (error: any) {
        console.error('Error completo:', error);
        alert('Error al registrar: ' + error.message);
      }
    }
  }
}