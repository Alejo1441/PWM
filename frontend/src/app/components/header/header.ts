import { Component, inject, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private dbService = inject(DatabaseService);

  usuarioLogueado = false;
  fotoPerfilUrl: string | null = null;

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.usuarioLogueado = true;

        this.dbService.listenUser(user.uid, (data) => {
          this.fotoPerfilUrl = data?.fotoPerfil || null;
        });
      } else {
        this.usuarioLogueado = false;
        this.fotoPerfilUrl = null;
      }
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
      this.router.navigate(['/home']);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }
}