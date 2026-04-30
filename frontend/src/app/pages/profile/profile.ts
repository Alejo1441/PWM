import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database';
import { StorageService } from '../../services/storage'; // Inyectamos el nuevo servicio

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.html',
    styleUrl: './profile.css'
})
export class Profile implements OnInit {
    private auth = inject(Auth);
    private dbService = inject(DatabaseService);
    private storageService = inject(StorageService); // Usamos el servicio
    private router = inject(Router);

    usuarioInfo: any = null;
    activePanel: 'cars' | 'booking' = 'cars';
    showModal: boolean = false;
    subiendoImagen: boolean = false; // Variable para controlar el estado de subida

    cocheForm = new FormGroup({
        marca: new FormControl('', Validators.required),
        modelo: new FormControl('', Validators.required),
        matricula: new FormControl('', Validators.required)
    });

    ngOnInit() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.dbService.listenUser(user.uid, (data) => {
                    this.usuarioInfo = data;
                });
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    setPanel(panel: 'cars' | 'booking') {
        this.activePanel = panel;
    }

    abrirModal() {
        this.showModal = true;
    }

    cerrarModal() {
        this.showModal = false;
        this.cocheForm.reset();
    }

    async anadirVehiculo() {
        const user = this.auth.currentUser;
        if (user && this.cocheForm.valid) {
            const { marca, modelo, matricula } = this.cocheForm.value;
            const textoCoche = `${marca} ${modelo} - ${matricula}`;

            try {
                await this.dbService.addVehiculo(user.uid, textoCoche);
                alert('Coche añadido correctamente');
                this.cerrarModal();
            } catch (e) {
                console.error("Error al añadir coche:", e);
            }
        }
    }

    async eliminarCoche(cocheTexto: string) {
        if (confirm("¿Seguro que quieres eliminar este vehículo?")) {
            const user = this.auth.currentUser;
            if (user) {
                await this.dbService.removeVehiculo(user.uid, cocheTexto);
            }
        }
    }

    async eliminarReserva(reservaObj: any) {
        if (confirm("¿Seguro que quieres cancelar esta reserva?")) {
            const user = this.auth.currentUser;
            if (user) {
                await this.dbService.removeReserva(user.uid, reservaObj);
            }
        }
    }


    async onFileSelected(event: any) {
        const file: File = event.target.files[0];
        const user = this.auth.currentUser;

        if (file && user) {
            this.subiendoImagen = true;
            try {
                // Llamamos al servicio de storage para subir la imagen y actualizar Firestore
                await this.storageService.subirFotoPerfil(file, user.uid);
                alert('Foto de perfil actualizada correctamente.');
            } catch (error) {
                alert('Error al subir la imagen. Revisa la consola para más detalles.');
            } finally {
                this.subiendoImagen = false;
            }
        }
    }
}