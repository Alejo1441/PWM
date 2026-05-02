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

    async ngOnInit() {
        // Obtenemos el ID del taller y el TIPO (politicas o preguntas) de la URL
        const idTaller = this.route.snapshot.queryParamMap.get('id');
        const tipo = this.route.snapshot.queryParamMap.get('tipo') || 'politicas';

        this.tituloPagina = tipo === 'politicas' ? 'Políticas del Taller' : 'Preguntas Frecuentes';

        if (idTaller) {
            const taller = await this.tallerService.getTallerById(idTaller);

            if (taller) {
                // Accedemos directamente al campo del taller (taller['politicas'] o taller['preguntas'])
                const datosNodo = (taller as any)[tipo];

                if (datosNodo) {
                    // Mapeamos el objeto de Firebase a nuestra lista
                    // Estructura: name_politica: ["Titulo", "Respuesta"]
                    this.itemsA_Mostrar = Object.keys(datosNodo).map(key => ({
                        titulo: datosNodo[key][0],
                        texto: datosNodo[key][1]
                    }));
                }
            }
        }

        this.cargando = false;
        this.cdr.detectChanges(); // Forzamos a Angular a pintar los datos
    }
}