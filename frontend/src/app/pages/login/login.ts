import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

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

  async enviarLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {

        await this.authService.login(email!, password!);
        console.log('¡Login exitoso!');
        this.router.navigate(['/profile']);

      } catch (error: any) {
        console.error('Error al iniciar sesión:', error.message);
        alert('Error: Correo o contraseña incorrectos');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  async enviarRegistro() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {

        await this.authService.registrarUsuario(this.registerForm.value, this.registerForm.value.password!);

        console.log('¡Usuario y Perfil creados!');
        alert('Cuenta creada con éxito. ¡Bienvenido!');
        this.router.navigate(['/profile']);

      } catch (error: any) {
        console.error('Error completo:', error);
        alert('Error al registrar: ' + error.message);
      }
    }
  }
}