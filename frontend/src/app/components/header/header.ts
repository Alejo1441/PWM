import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth'; // Importamos signOut
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  usuarioLogueado = false;

  ngOnInit() {
    // Escuchamos si el usuario entra o sale para mostrar/ocultar el botón
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogueado = !!user; // Si existe user, es true
    });
  }

  manejarClicPerfil() {
    if (this.auth.currentUser) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async salir() {
    try {
      await signOut(this.auth);
      console.log("Sesión cerrada");
      this.router.navigate(['/home']); // Al salir, lo mandamos al Home
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }
}