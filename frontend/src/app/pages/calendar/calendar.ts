import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TallerService } from '../../services/taller';

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
    private tallerService = inject(TallerService);
    private cdr = inject(ChangeDetectorRef);

    currentDate: Date = new Date();
    selectedDate: string | null = null;
    selectedSlot: string | null = null;
    tallerInfo: any = null;
    servicioNombre: string = '';

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
        const idTaller = this.route.snapshot.paramMap.get('id');
        this.servicioNombre = this.route.snapshot.queryParamMap.get('servicio') || 'Servicio General';

        this.generateYears();
        this.renderCalendar();

        if (idTaller) {
            try {
                const data = await this.tallerService.getTallerById(idTaller);
                if (data) {
                    this.tallerInfo = data;


                    if (this.tallerInfo.fotoperfil) {
                        this.tallerInfo.image = [this.tallerInfo.fotoperfil];
                    }

                    this.cdr.detectChanges();
                } else {
                    this.tallerInfo = { name: 'Taller no encontrado' };
                }
            } catch (error) {
                console.error("Error al obtener taller:", error);
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

        const reservation = {
            date: this.selectedDate,
            time: this.selectedSlot,
            taller: this.tallerInfo?.name || "Taller",
            servicio: this.servicioNombre
        };

        localStorage.setItem("reservation", JSON.stringify(reservation));
        const idTaller = this.route.snapshot.paramMap.get('id');

        if (idTaller) {
            this.router.navigate(['/car_select', idTaller], { queryParamsHandling: 'preserve' });
        } else {
            this.router.navigate(['/car_select'], { queryParamsHandling: 'preserve' });
        }
    }
}