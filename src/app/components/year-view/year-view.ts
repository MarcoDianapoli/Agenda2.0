import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../services/appointment';
import { Cita } from '../../models/appointment.model';

@Component({
  selector: 'app-year-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-view.html',
  styleUrl: './year-view.css',
})
export class YearViewComponent implements OnInit, OnDestroy {
  @Output() monthSelected = new EventEmitter<number>();
  @Output() daySelected = new EventEmitter<Date>();

  currentYear: number = new Date().getFullYear();
  months: { name: string, number: number }[] = [];
  appointmentCountsByMonth: { [key: number]: number } = {};
  
  private subscription: Subscription = new Subscription();
  allAppointments: Cita[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.initMonths();
    this.subscription = this.appointmentService.appointments$.subscribe(citas => {
      this.allAppointments = citas;
      this.calculateMonthlyCounts();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initMonths(): void {
    this.months = [
      { name: 'Enero', number: 0 },
      { name: 'Febrero', number: 1 },
      { name: 'Marzo', number: 2 },
      { name: 'Abril', number: 3 },
      { name: 'Mayo', number: 4 },
      { name: 'Junio', number: 5 },
      { name: 'Julio', number: 6 },
      { name: 'Agosto', number: 7 },
      { name: 'Septiembre', number: 8 },
      { name: 'Octubre', number: 9 },
      { name: 'Noviembre', number: 10 },
      { name: 'Diciembre', number: 11 }
    ];
  }

  private calculateMonthlyCounts(): void {
    this.appointmentCountsByMonth = {};
    this.allAppointments.forEach(cita => {
      const d = new Date(cita.date);
      if (d.getFullYear() === this.currentYear) {
        const month = d.getMonth();
        this.appointmentCountsByMonth[month] = (this.appointmentCountsByMonth[month] || 0) + 1;
      }
    });
  }

  getAppointmentCount(month: number): number {
    return this.appointmentCountsByMonth[month] || 0;
  }

  onMonthClick(monthNumber: number): void {
    this.monthSelected.emit(monthNumber);
  }

  previousYear(): void {
    this.currentYear--;
    this.calculateMonthlyCounts();
  }

  nextYear(): void {
    this.currentYear++;
    this.calculateMonthlyCounts();
  }
}
