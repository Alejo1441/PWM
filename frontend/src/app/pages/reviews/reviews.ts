import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TallerService } from '../../services/taller';

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


                if (this.tallerInfo.fotoperfil) {
                    this.tallerInfo.image = [this.tallerInfo.fotoperfil];
                }


                if (this.tallerInfo.reviews) {

                    if (!Array.isArray(this.tallerInfo.reviews)) {

                        if (!this.tallerInfo.reviews.username) {
                            this.tallerInfo.reviews = Object.values(this.tallerInfo.reviews);
                        } else {

                            this.tallerInfo.reviews = [this.tallerInfo.reviews];
                        }
                    }
                }


                this.cdr.detectChanges();
            }
        }
    }


    getEstrellasVisuales(stars: number): string {
        if (!stars) return '☆☆☆☆☆';
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
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