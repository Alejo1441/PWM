import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-car-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './car_select.html',
    styleUrl: './car_select.css',
})
export class CarSelect implements OnInit {
    selectedCar = 'Ninguno';
    reservationText = 'Día y fecha';

    tallerName = '';
    serviceName = 'nombre servicio';
    priceText = 'Precio';

    cars: string[] = [];
    reservation: any = null;
    sesion: any = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {}

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    async ngOnInit(): Promise<void> {
        if (!this.isBrowser()) return;

        this.sesion = JSON.parse(localStorage.getItem('usuario_logeado') || 'null');

        if (!this.sesion) {
            this.sesion = {
                username: 'Daniel',
                email: 'test@gmail.com',
                car: ['Seat Ibiza - 1234 ABC', 'Toyota Yaris - 5678 DEF'],
                bookings: []
            };

            localStorage.setItem('usuario_logeado', JSON.stringify(this.sesion));
        }

        this.reservation = JSON.parse(localStorage.getItem('reservation') || 'null');

        if (this.reservation) {
            this.reservationText = `${this.reservation.date} a las ${this.reservation.time}`;
        }

        this.cars = this.sesion.car || [];

        await this.loadWorkshopData();
    }

    async loadWorkshopData(): Promise<void> {
        if (!this.isBrowser()) return;

        const servicioActual =
            this.route.snapshot.queryParamMap.get('especialidad') ||
            this.route.snapshot.queryParamMap.get('servicio') ||
            this.reservation?.servicio ||
            localStorage.getItem('selectedServiceName');

        if (servicioActual) {
            this.serviceName = servicioActual;

            const precios: Record<string, number> = {
                'cambiar aceite': 30,
                'cambiar rueda': 29
            };

            const precio = precios[servicioActual.trim().toLowerCase()];
            this.priceText = precio ? `${precio} €` : 'Precio';
        }

        try {
            const response = await fetch('/json/content.json');

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            const idActual =
                this.route.snapshot.queryParamMap.get('id') ||
                localStorage.getItem('temp_taller_id');

            const taller = data.talleres?.find((t: any) => String(t.id) === String(idActual));

            if (!taller) return;

            this.tallerName = taller.name;

            if (servicioActual) {
                const servicioLimpio = servicioActual.trim().toLowerCase();

                const servicio = taller.speciality?.find((s: any) =>
                    s.service.trim().toLowerCase() === servicioLimpio
                );

                if (servicio) {
                    this.serviceName = servicio.service;
                    this.priceText = `${servicio.price} €`;
                }
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }

    selectCar(car: string): void {
        this.selectedCar = car;

        if (this.isBrowser()) {
            localStorage.setItem('selectedCar', car);
        }
    }

    confirmReservation(): void {
        if (!this.isBrowser()) return;

        const selectedCar = localStorage.getItem('selectedCar');

        if (!this.reservation) {
            alert('No hay ninguna reserva seleccionada.');
            return;
        }

        if (!selectedCar) {
            alert('Selecciona primero un vehículo.');
            return;
        }

        const nuevaReserva =
            `${this.tallerName || this.reservation.taller || 'Taller'}: ${selectedCar} - ${this.reservation.date} (${this.reservation.time})`;

        this.sesion.bookings = this.sesion.bookings || [];
        this.sesion.bookings.push(nuevaReserva);

        this.guardarReserva(this.sesion);

        alert('Reserva confirmada correctamente');

        localStorage.removeItem('reservation');
        localStorage.removeItem('selectedCar');
        localStorage.removeItem('temp_taller_name');
        localStorage.removeItem('selectedServiceName');

        this.router.navigate(['/home']);
    }

    guardarReserva(user: any): void {
        if (!this.isBrowser()) return;

        localStorage.setItem('usuario_logeado', JSON.stringify(user));

        const baseDatos = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
        const index = baseDatos.findIndex((u: any) => u.email === user.email);

        if (index !== -1) {
            baseDatos[index] = user;
            localStorage.setItem('usuarios_registrados', JSON.stringify(baseDatos));
        }
    }
}