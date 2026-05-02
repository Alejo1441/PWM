import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { TallerService } from '../../services/taller';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // Quitamos el componente antiguo porque lo haremos directo
  templateUrl: './home.html',
  styleUrl: './home.css' // Opcional, por si tienes CSS
})
export class Home implements OnInit {
  private tallerService = inject(TallerService);
  private auth = inject(Auth);
  private router = inject(Router);

  talleres: any[] = [];

  async ngOnInit() {
    const talleresFirebase = await this.tallerService.getAllTalleres();

    // Mapeamos (transformamos) los datos para que el HTML sea súper limpio
    this.talleres = talleresFirebase.map((taller: any) => {

      // 1. Calculamos la imagen
      let imgFondo = '../../assets/imagen.png';
      if (taller.fotoperfil) {
        imgFondo = this.getImageUrl(taller.fotoperfil);
      }

      // 2. Calculamos las estrellas
      let numReviews = 0;
      let estrellasVis = '☆☆☆☆☆';

      if (taller.reviews) {
        const reviewsArray = Array.isArray(taller.reviews) ? taller.reviews : [taller.reviews];
        numReviews = reviewsArray.length;
        if (numReviews > 0) {
          const suma = reviewsArray.reduce((acc: any, rev: any) => acc + rev.stars, 0);
          const prom = Math.round(suma / numReviews);
          estrellasVis = '★'.repeat(prom) + '☆'.repeat(5 - prom);
        }
      }

      // Devolvemos el taller con estos datos extra listos para pintar
      return {
        ...taller,
        fotoVisual: imgFondo,
        numeroResenas: numReviews,
        estrellasVisuales: estrellasVis
      };
    });
  }

  getImageUrl(url: string): string {
    if (!url) return '../../assets/imagen.png';
    if (url.startsWith('http')) return url;
    let cleanUrl = url.replace('../', '').replace('../../', '');
    return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
  }

  // MÉTODO ESTRELLA: Aquí se decide a dónde va el usuario
  irAlTaller(idTaller: string) {
    if (this.auth.currentUser) {
      // Usuario autenticado -> Va al taller
      this.router.navigate(['/TallerInformacion', idTaller]);
    } else {
      // Usuario NO autenticado -> Va a Login
      this.router.navigate(['/login']);
    }
  }
}