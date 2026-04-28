import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.html',
    styleUrl: './profile.css'
})
export class Profile implements OnInit {
    private auth = inject(Auth);
    private db = inject(Firestore);
    private router = inject(Router);

    usuarioInfo: any = null;
    activePanel: 'cars' | 'booking' = 'cars';

    // Variable para controlar si el modal se ve o no
    showModal: boolean = false;

    cocheForm = new FormGroup({
        marca: new FormControl('', Validators.required),
        modelo: new FormControl('', Validators.required),
        matricula: new FormControl('', Validators.required)
    });

    ngOnInit() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                onSnapshot(doc(this.db, 'usuarios', user.uid), (snapshot) => {
                    this.usuarioInfo = snapshot.data();
                });
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    setPanel(panel: 'cars' | 'booking') {
        this.activePanel = panel;
    }

    // Funciones para abrir y cerrar el modal
    abrirModal() {
        this.showModal = true;
    }

    cerrarModal() {
        this.showModal = false;
        this.cocheForm.reset(); // Vaciamos el formulario al cancelar
    }

    async anadirVehiculo() {
        const user = this.auth.currentUser;
        if (user && this.cocheForm.valid) {
            const { marca, modelo, matricula } = this.cocheForm.value;
            const textoCoche = `${marca} ${modelo} - ${matricula}`;

            try {
                await updateDoc(doc(this.db, 'usuarios', user.uid), {
                    vehiculos: arrayUnion(textoCoche)
                });
                alert('Coche añadido correctamente');
                this.cerrarModal(); // Cerramos el modal tras añadir con éxito
            } catch (e) {
                console.error("Error al añadir coche:", e);
            }
        }
    }

    async eliminarCoche(cocheTexto: string) {
        if (confirm("¿Seguro que quieres eliminar este vehículo?")) {
            const user = this.auth.currentUser;
            if (user) {
                await updateDoc(doc(this.db, 'usuarios', user.uid), {
                    vehiculos: arrayRemove(cocheTexto)
                });
            }
        }
    }

    async eliminarReserva(reservaTexto: string) {
        if (confirm("¿Seguro que quieres cancelar esta reserva?")) {
            const user = this.auth.currentUser;
            if (user) {
                await updateDoc(doc(this.db, 'usuarios', user.uid), {
                    reservas: arrayRemove(reservaTexto)
                });
            }
        }
    }
}