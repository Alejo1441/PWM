import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { TallerService } from '../../services/taller';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private tallerService = inject(TallerService);
  private auth = inject(Auth);
  private router = inject(Router);

  talleres: any[] = [];

  async ngOnInit() {
    const talleresFirebase = await this.tallerService.getAllTalleres();


    this.talleres = talleresFirebase.map((taller: any) => {

      let imgFondo = '../../assets/imagen.png';
      if (taller.fotoperfil) {
        imgFondo = this.getImageUrl(taller.fotoperfil);
      }


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


  irAlTaller(idTaller: string) {
    if (this.auth.currentUser) {

      this.router.navigate(['/TallerInformacion', idTaller]);
    } else {

      this.router.navigate(['/login']);
    }
  }
}