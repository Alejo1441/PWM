import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';

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
    private db = inject(Firestore);

    reservaInfo: any = null;
    tallerInfo: any = null;
    cochesUsuario: string[] = [];
    cocheSeleccionado: string | null = null;
    precioEstimado: number | string = 'Calculando...';

    async ngOnInit() {
        // 1. Verificar sesión
        const usuarioActual = this.auth.currentUser;
        if (!usuarioActual) {
            this.router.navigate(['/login']);
            return;
        }

        // 2. Recuperar reserva temporal
        const reservaGuardada = localStorage.getItem("reservation");
        if (!reservaGuardada) {
            this.router.navigate(['/home']);
            return;
        }
        this.reservaInfo = JSON.parse(reservaGuardada);

        // 3. Cargar datos del usuario (Coches)
        const userDocRef = doc(this.db, 'usuarios', usuarioActual.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // CAMBIO CLAVE: Usamos 'vehiculos' que es tu nombre de campo en Firebase
            this.cochesUsuario = userData['vehiculos'] || [];
            console.log("Vehículos cargados:", this.cochesUsuario);
        }

        // 4. Cargar datos del taller (Fondo y Precio)
        const idTaller = this.route.snapshot.paramMap.get('id');
        if (idTaller) {
            const tallerRef = doc(this.db, 'talleres', idTaller);
            const tallerSnap = await getDoc(tallerRef);

            if (tallerSnap.exists()) {
                this.tallerInfo = tallerSnap.data();
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

        // Estructura de la reserva que irá al Perfil
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
            const userDocRef = doc(this.db, 'usuarios', usuarioActual.uid);

            // Guardamos la reserva dentro del array 'reservas' del usuario
            await updateDoc(userDocRef, {
                reservas: arrayUnion(nuevaReserva)
            });

            alert("¡Reserva confirmada! Ya puedes verla en tu perfil.");
            localStorage.removeItem("reservation");
            this.router.navigate(['/profile']);

        } catch (error) {
            console.error("Error guardando reserva:", error);
            alert("Error al confirmar la reserva");
        }
    }
}