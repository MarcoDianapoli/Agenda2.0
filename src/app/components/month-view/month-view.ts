import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../services/appointment';
import { Cita, AppointmentStatus } from '../../models/appointment.model';

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-view.html',
  styleUrl: './month-view.css',
})
export class MonthViewComponent implements OnInit, OnDestroy {
  @Input() year!: number;
  @Input() month!: number;
  @Output() daySelected = new EventEmitter<Date>();
  @Output() back = new EventEmitter<void>();

  days: { date: Date, dayNumber: number, citasCount: number, statuses: string[] }[] = [];
  monthName: string = '';
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  private subscription: Subscription = new Subscription();
  allAppointments: Cita[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadMonthName();
    this.subscription = this.appointmentService.appointments$.subscribe(citas => {
      this.allAppointments = citas;
      this.generateDays();
    });
  }

  ngOnChanges(): void {
    if (this.year !== undefined && this.month !== undefined) {
      this.loadMonthName();
      this.generateDays();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadMonthName(): void {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.monthName = months[this.month] + ' ' + this.year;
  }

  private generateDays(): void {
    this.days = [];
    const firstDay = new Date(this.year, this.month, 1);
    const lastDay = new Date(this.year, this.month + 1, 0);
    const startOffset = firstDay.getDay(); // 0=Sunday
    const totalDays = lastDay.getDate();

    // Días vacíos al inicio
    for (let i = 0; i < startOffset; i++) {
      this.days.push({ date: new Date(0), dayNumber: 0, citasCount: 0, statuses: [] });
    }

    // Días del mes
    for (let d = 1; d <= totalDays; d++) {
      const currentDate = new Date(this.year, this.month, d);
      const citasToday = this.allAppointments.filter(c => {
        const cd = new Date(c.date);
        return cd.getFullYear() === this.year && 
               cd.getMonth() === this.month && 
               cd.getDate() === d;
      });
      
      const statuses = [...new Set(citasToday.map(c => c.status))];
      
      this.days.push({
        date: currentDate,
        dayNumber: d,
        citasCount: citasToday.length,
        statuses: statuses
      });
    }
  }

  onDayClick(day: any): void {
    if (day.dayNumber > 0) {
      this.daySelected.emit(day.date);
    }
  }

  goBack(): void {
    this.back.emit();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'confirmed': '#4CAF50',
      'arrived': '#2196F3',
      'in_progress': '#FFC107',
      'completed': '#00897B',
      'cancelled': '#F44336',
      'no_show': '#9E9E9E',
      'rescheduled': '#9C27B0'
    };
    return colors[status] || '#000000';
  }

  isToday(day: any): boolean {
    if (day.dayNumber === 0) return false;
    const today = new Date();
    return day.date.getFullYear() === today.getFullYear() &&
           day.date.getMonth() === today.getMonth() &&
           day.date.getDate() === today.getDate();
  }
}
