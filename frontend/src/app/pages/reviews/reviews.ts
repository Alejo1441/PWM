import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TallerService } from '../../services/taller'; // Asegúrate de que la ruta es correcta

@Component({
    selector: 'app-reviews',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reviews.html',
    styleUrl: './reviews.css'
})
export class Reviews implements OnInit {
    private route = inject(ActivatedRoute);
    private tallerService = inject(TallerService);
    private cdr = inject(ChangeDetectorRef);

    tallerInfo: any = null;

    async ngOnInit() {
        const idTaller = this.route.snapshot.paramMap.get('id');

        if (idTaller) {
            this.tallerInfo = await this.tallerService.getTallerById(idTaller);

            if (this.tallerInfo) {

                // --- TRADUCTOR DE FIREBASE ---

                // 1. Traducimos la foto para el fondo
                if (this.tallerInfo.fotoperfil) {
                    this.tallerInfo.image = [this.tallerInfo.fotoperfil];
                }

                // 2. Arreglo de reseñas: Las pasamos a Array para que el HTML pueda hacer el bucle
                if (this.tallerInfo.reviews) {
                    // Si Firebase devuelve un solo objeto (como vimos con la reseña de "Jose")
                    if (!Array.isArray(this.tallerInfo.reviews)) {
                        // Si es un Diccionario/Map (por si en el futuro añades más reseñas desde Firebase)
                        if (!this.tallerInfo.reviews.username) {
                            this.tallerInfo.reviews = Object.values(this.tallerInfo.reviews);
                        } else {
                            // Si es un objeto literal directo
                            this.tallerInfo.reviews = [this.tallerInfo.reviews];
                        }
                    }
                }

                // Forzamos actualización visual
                this.cdr.detectChanges();
            }
        }
    }

    // Método auxiliar para pintar las estrellas visuales de cada review
    getEstrellasVisuales(stars: number): string {
        if (!stars) return '☆☆☆☆☆';
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }

    // Formateador de la imagen de fondo
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