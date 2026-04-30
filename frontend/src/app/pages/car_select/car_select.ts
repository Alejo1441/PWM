import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { DatabaseService } from '../../services/database';
import { TallerService } from '../../services/taller';

@Component({
    selector: 'app-car-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './car_select.html',
    styleUrl: './car_select.css'
})
export class CarSelect implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(Auth);
    private dbService = inject(DatabaseService); // Nuevo
    private tallerService = inject(TallerService); // Nuevo

    reservaInfo: any = null;
    tallerInfo: any = null;
    cochesUsuario: string[] = [];
    cocheSeleccionado: string | null = null;
    precioEstimado: number | string = 'Calculando...';

    async ngOnInit() {
        const usuarioActual = this.auth.currentUser;
        if (!usuarioActual) {
            this.router.navigate(['/login']);
            return;
        }

        const reservaGuardada = localStorage.getItem("reservation");
        if (!reservaGuardada) {
            this.router.navigate(['/home']);
            return;
        }
        this.reservaInfo = JSON.parse(reservaGuardada);

        // Usamos el servicio de base de datos
        const userData = await this.dbService.getUserOnce(usuarioActual.uid);
        if (userData) {
            this.cochesUsuario = userData['vehiculos'] || [];
        }

        const idTaller = this.route.snapshot.paramMap.get('id');
        if (idTaller) {
            // Usamos el servicio de talleres
            const tallerData = await this.tallerService.getTallerById(idTaller);
            if (tallerData) {
                this.tallerInfo = tallerData;
                this.calcularPrecio();
            }
        }
    }

    calcularPrecio() {
        if (!this.tallerInfo || !this.reservaInfo.servicio) return;
        const servicioBuscado = this.reservaInfo.servicio.trim().toLowerCase();
        const servicioEncontrado = this.tallerInfo.speciality?.find((s: any) =>
            s.service.trim().toLowerCase() === servicioBuscado
        );
        this.precioEstimado = servicioEncontrado ? `${servicioEncontrado.price} €` : 'A consultar';
    }

    irAlPerfil() {
        this.router.navigate(['/profile']);
    }

    async confirmarReserva() {
        if (!this.cocheSeleccionado) {
            alert("Selecciona un vehículo");
            return;
        }

        const usuarioActual = this.auth.currentUser;
        if (!usuarioActual) return;

        const nuevaReserva = {
            taller: this.reservaInfo.taller,
            fecha: this.reservaInfo.date,
            hora: this.reservaInfo.time,
            servicio: this.reservaInfo.servicio,
            vehiculo: this.cocheSeleccionado,
            precio: this.precioEstimado,
            estado: 'Confirmada',
            fechaRegistro: new Date()
        };

        try {

            await this.dbService.addReserva(usuarioActual.uid, nuevaReserva);

            alert("¡Reserva confirmada! Ya puedes verla en tu perfil.");
            localStorage.removeItem("reservation");
            this.router.navigate(['/profile']);

        } catch (error) {
            console.error("Error guardando reserva:", error);
            alert("Error al confirmar la reserva");
        }
    }
}