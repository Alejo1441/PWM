import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TallerService } from '../../services/taller';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text.html',
  styleUrl: './text.css'
})
export class InfoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tallerService = inject(TallerService);
  private cdr = inject(ChangeDetectorRef);

  itemsA_Mostrar: { titulo: string, texto: string }[] = [];
  tituloPagina: string = '';
  cargando: boolean = true;
  tallerInfo: any = null;

  ngOnInit() {
    this.route.queryParamMap.subscribe(async (queryParams) => {

      this.cargando = true;
      this.itemsA_Mostrar = [];

      const idTaller = this.route.snapshot.paramMap.get('id');

      const tipo = queryParams.get('tipo') || 'politicas';

      this.tituloPagina = tipo === 'politicas' ? 'Políticas del Taller' : 'Preguntas Frecuentes';

      if (idTaller) {
        const taller = await this.tallerService.getTallerById(idTaller);

        if (taller) {
          this.tallerInfo = taller;
          const datosNodo = (taller as any)[tipo];

          if (datosNodo) {
            this.itemsA_Mostrar = Object.keys(datosNodo).map(key => ({
              titulo: datosNodo[key][0],
              texto: datosNodo[key][1]
            }));
          }
        }
      }

      if (this.tallerInfo.fotoperfil) {
        this.tallerInfo.image = [this.tallerInfo.fotoperfil];
      }

      this.cargando = false;
      this.cdr.detectChanges(); // Forzamos a Angular a pintar los datos actualizados
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
