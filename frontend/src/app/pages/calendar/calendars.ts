import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CalendarDay = {
  day: number | null;
  date: string | null;
  isToday: boolean;
};

type Slot = {
  time: string;
  busy: boolean;
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
  title = 'Servicio Ofrecido';

  currentDate = new Date();
  selectedDate = '';
  selectedSlot = '';

  selectedMonth = this.currentDate.getMonth();
  selectedYear = this.currentDate.getFullYear();

  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  years: number[] = [];

  days: CalendarDay[] = [];
  slots: Slot[] = [];

  startHour = 8;
  endHour = 20;

  reservedSlots: Record<string, string[]> = {
    '2026-03-18': ['08:00-09:00', '10:00-11:00', '15:00-16:00'],
    '2026-03-19': ['09:00-10:00', '12:00-13:00', '18:00-19:00'],
    '2026-03-20': ['08:00-09:00', '11:00-12:00', '16:00-17:00', '19:00-20:00']
  };

  constructor(
      private router: Router,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fillYears();

    const idTaller = this.route.snapshot.queryParamMap.get('id');
    const servicio = this.route.snapshot.queryParamMap.get('servicio');

    if (idTaller) {
      localStorage.setItem('temp_taller_id', idTaller);
    }

    if (servicio) {
      this.title = `Servicio Ofrecido: ${servicio}`;
    }

    this.renderCalendar();
  }

  fillYears(): void {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 1; year <= currentYear + 3; year++) {
      this.years.push(year);
    }
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
    this.renderCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
    this.renderCalendar();
  }

  changeMonth(): void {
    this.currentDate.setMonth(Number(this.selectedMonth));
    this.renderCalendar();
  }

  changeYear(): void {
    this.currentDate.setFullYear(Number(this.selectedYear));
    this.renderCalendar();
  }

  renderCalendar(): void {
    this.days = [];

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const todayString = this.formatDate(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    for (let i = 0; i < firstDay; i++) {
      this.days.push({
        day: null,
        date: null,
        isToday: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = this.formatDate(year, month, day);

      this.days.push({
        day,
        date: dateString,
        isToday: dateString === todayString
      });
    }

    if (today.getFullYear() === year && today.getMonth() === month) {
      this.selectedDate = todayString;
    } else {
      this.selectedDate = this.formatDate(year, month, 1);
    }

    this.renderSlots();
  }

  selectDay(date: string | null): void {
    if (!date) return;

    this.selectedDate = date;
    this.selectedSlot = '';
    this.renderSlots();
  }

  renderSlots(): void {
    this.slots = [];

    const reserved = this.reservedSlots[this.selectedDate] || [];

    for (let hour = this.startHour; hour < this.endHour; hour++) {
      const start = `${String(hour).padStart(2, '0')}:00`;
      const end = `${String(hour + 1).padStart(2, '0')}:00`;
      const slotText = `${start}-${end}`;

      this.slots.push({
        time: slotText,
        busy: reserved.includes(slotText)
      });
    }
  }

  selectSlot(slot: Slot): void {
    if (slot.busy) return;

    this.selectedSlot = slot.time;
  }

  reserveDate(): void {
    if (!this.selectedDate) {
      alert('Selecciona primero una fecha.');
      return;
    }

    if (!this.selectedSlot) {
      alert('Selecciona primero una hora disponible.');
      return;
    }

    const reservation = {
      date: this.selectedDate,
      time: this.selectedSlot,
      taller: localStorage.getItem('temp_taller_name') || 'Taller'
    };

    localStorage.setItem('reservation', JSON.stringify(reservation));

    const queryParams = this.route.snapshot.queryParams;

    this.router.navigate(['/car_select'], { queryParams });
  }

  formatDate(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}