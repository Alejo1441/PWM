import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './calendar.html',
    styleUrl: './calendar.css'
})
export class Calendar implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private db = inject(Firestore);

    // Estado
    currentDate: Date = new Date();
    selectedDate: string | null = null;
    selectedSlot: string | null = null;
    tallerInfo: any = null;
    servicioNombre: string = '';

    // Datos de configuración
    calendarData = {
        startHour: 8,
        endHour: 18,
        reservedSlots: {} as { [key: string]: string[] }
    };

    months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    years: number[] = [];
    daysInMonth: number[] = [];
    emptyDays: any[] = [];

    async ngOnInit() {
        // 1. Obtenemos parámetros de la URL
        const idTaller = this.route.snapshot.paramMap.get('id');
        this.servicioNombre = this.route.snapshot.queryParamMap.get('servicio') || 'Servicio General';

        // 2. ¡DIBUJAMOS EL CALENDARIO INMEDIATAMENTE! (Esto arregla el bug visual)
        this.generateYears();
        this.renderCalendar();

        // 3. Pedimos los datos a Firebase
        if (idTaller) {
            try {
                console.log("Buscando en Firebase el taller con ID:", idTaller);

                const docRef = doc(this.db, 'talleres', idTaller);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    this.tallerInfo = docSnap.data();
                    console.log("¡Datos del taller descargados!", this.tallerInfo);
                } else {
                    console.warn("Firebase dice que NO EXISTE un documento con el ID:", idTaller);
                    this.tallerInfo = { name: 'Taller no encontrado' }; // Para que no se quede cargando
                }
            } catch (error) {
                console.error("Error al intentar leer de Firebase:", error);
                this.tallerInfo = { name: 'Error de conexión' };
            }
        }
    }

    generateYears() {
        const currentYear = new Date().getFullYear();
        this.years = [];
        for (let i = currentYear - 1; i <= currentYear + 3; i++) {
            this.years.push(i);
        }
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysCount = new Date(year, month + 1, 0).getDate();

        this.emptyDays = Array(firstDay).fill(null);
        this.daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);

        // Selección por defecto al cambiar de mes
        const today = new Date();
        if (today.getFullYear() === year && today.getMonth() === month) {
            this.selectDate(this.formatDate(year, month, today.getDate()));
        } else {
            this.selectDate(this.formatDate(year, month, 1));
        }
    }

    selectDate(date: string) {
        this.selectedDate = date;
        this.selectedSlot = null;
    }

    getSlots() {
        const slots = [];
        for (let h = this.calendarData.startHour; h < this.calendarData.endHour; h++) {
            const start = `${String(h).padStart(2, '0')}:00`;
            const end = `${String(h + 1).padStart(2, '0')}:00`;
            slots.push(`${start}-${end}`);
        }
        return slots;
    }

    isSlotBusy(slot: string): boolean {
        if (!this.selectedDate) return false;
        const busy = this.calendarData.reservedSlots[this.selectedDate] || [];
        return busy.includes(slot);
    }

    // Métodos para los selectores
    updateMonth(newMonth: any) {
        this.currentDate.setMonth(parseInt(newMonth));
        this.renderCalendar();
    }

    updateYear(newYear: any) {
        this.currentDate.setFullYear(parseInt(newYear));
        this.renderCalendar();
    }

    changeMonth(delta: number) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    formatDate(year: number, month: number, day: number): string {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    confirmarReserva() {
        if (!this.selectedDate || !this.selectedSlot) {
            alert("Por favor, selecciona fecha y hora.");
            return;
        }

        // 1. Empaquetamos la información del día, hora y taller
        const reservation = {
            date: this.selectedDate,
            time: this.selectedSlot,
            taller: this.tallerInfo?.name || "Taller",
            servicio: this.servicioNombre
        };

        // 2. Lo guardamos en la memoria temporal del navegador
        localStorage.setItem("reservation", JSON.stringify(reservation));

        // 3. Rescatamos el ID del taller de la URL actual
        const idTaller = this.route.snapshot.paramMap.get('id');

        // 4. Navegamos a car_select pasándole el ID del taller
        // Mantenemos los queryParams por si había información del servicio (?servicio=...)
        if (idTaller) {
            this.router.navigate(['/car_select', idTaller], { queryParamsHandling: 'preserve' });
        } else {
            this.router.navigate(['/car_select'], { queryParamsHandling: 'preserve' });
        }
    }
}