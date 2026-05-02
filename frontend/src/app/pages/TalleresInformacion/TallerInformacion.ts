import { Component, OnInit, inject, ChangeDetectorRef ,EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TallerService } from '../../services/taller';

@Component({
  selector: 'app-taller-informacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tallerInformacion.html',
  styleUrl: './StyleTallerInformacion.css'
})
export class TallerInformacion implements OnInit {
  private route = inject(ActivatedRoute);
  private tallerService = inject(TallerService);
  private cdr = inject(ChangeDetectorRef); // HERRAMIENTA NUEVA: Para forzar el redibujado de la pantalla
  private injector = inject(EnvironmentInjector);
  private db = inject(Firestore);


  tallerInfo: any = null;
  promedioEstrellas: string = '☆☆☆☆☆';
  numeroResenas: number = 0;

  async ngOnInit() {
    const idTaller = this.route.snapshot.paramMap.get('id');

    if (idTaller) {
      this.tallerInfo = await this.tallerService.getTallerById(idTaller);

      if (this.tallerInfo) {

        // 1. ARREGLO DE SERVICIOS
        // Tu BD manda un objeto "service", lo convertimos al Array "speciality" que espera el HTML
        if (this.tallerInfo.service) {
          this.tallerInfo.speciality = Object.keys(this.tallerInfo.service).map(nombreServicio => {
            return { service: nombreServicio, price: this.tallerInfo.service[nombreServicio] };
          });
        }

        // 2. ARREGLO DE IMÁGENES
        // Tu BD manda "fotoperfil" como texto, lo metemos en el Array "image" que espera el HTML
        if (this.tallerInfo.fotoperfil) {
          this.tallerInfo.image = [this.tallerInfo.fotoperfil];
        }

        // 3. ARREGLO DE RESEÑAS
        // Tu BD manda una sola reseña como objeto, la metemos en un Array para que funcione el .length
        if (this.tallerInfo.reviews) {
          if (!Array.isArray(this.tallerInfo.reviews)) {
            this.tallerInfo.reviews = [this.tallerInfo.reviews];
          }
          this.calcularEstrellas();
        }

        // Forzamos la actualización de la pantalla
        this.cdr.detectChanges();
      }
    }
  }

  calcularEstrellas() {
    this.numeroResenas = this.tallerInfo.reviews.length;
    if (this.numeroResenas > 0) {
      const suma = this.tallerInfo.reviews.reduce((acc: any, review: any) => acc + review.stars, 0);
      const promedio = Math.round(suma / this.numeroResenas);
      this.promedioEstrellas = '★'.repeat(promedio) + '☆'.repeat(5 - promedio);
    }
  }
  async getTallerById(id: string) {
    return runInInjectionContext(this.injector, async () => {
      const docRef = doc(this.db, 'talleres', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    });
  }

  getImageUrl(url: string): string {
    if (!url) return '../../assets/imagen.png';
    if (url.startsWith('http')) return url;

    let cleanUrl = url.replace('../', '').replace('../../', '');
    if (!cleanUrl.startsWith('/')) {
      cleanUrl = '/' + cleanUrl;
    }
    return cleanUrl;
  }
}