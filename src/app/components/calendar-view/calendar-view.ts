import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf, NgForOf} from '@angular/common';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../services/appointment';
import { Cita,
           AppointmentStatus,
           PaymentStatus,
           AppointmentStatusLabels,
           PaymentStatusLabels
        } from '../../models/appointment.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,  // Si usas standalone components
  imports: [NgIf, NgForOf,CommonModule],
  templateUrl: './calendar-view.html',
  styleUrls: ['./calendar-view.css']
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  // Eventos para comunicarse con el componente padre
  @Output() editCita = new EventEmitter<Cita>();
  @Output() changeStatusCita = new EventEmitter<Cita>();
  @Output() changePaymentStatusCita = new EventEmitter<Cita>();
  
  // Fecha actual seleccionada (empieza en HOY)
  selectedDate: Date = new Date();
  
  // Todas las citas del sistema
  allAppointments: Cita[] = [];
  
  // Citas filtradas para el día seleccionado
  todayAppointments: Cita[] = [];
  
  // Suscripción al servicio (para poder cancelarla después)
  private subscription: Subscription = new Subscription();
  
  // Inyectar el servicio
  constructor(private appointmentService: AppointmentService) {}
  
  // Al iniciar el componente
  ngOnInit(): void {
    // Suscribirse al observable de citas
    this.subscription = this.appointmentService.appointments$.subscribe(
      (citas: Cita[]) => {
        this.allAppointments = citas;
        this.filterAppointmentsByDate(); // Filtrar para el día actual
      }
    );
  }
  
  // Al destruir el componente (buena práctica)
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  // Filtrar citas por la fecha seleccionada
  filterAppointmentsByDate(): void {
    this.todayAppointments = this.allAppointments.filter(cita => {
      const citaDate = new Date(cita.date);
      return this.isSameDay(citaDate, this.selectedDate);
    });
    
    // Ordenar por hora
    this.todayAppointments.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  }
  
  // Comparar si dos fechas son el mismo día
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  // Método para ir al día siguiente
  goToNextDay(): void {
    this.selectedDate = new Date(this.selectedDate);
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.filterAppointmentsByDate();
  }
  
  // Método para ir al día anterior
  goToPreviousDay(): void {
    this.selectedDate = new Date(this.selectedDate);
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.filterAppointmentsByDate();
  }
  
  // Método para ir a un día específico (desde DateNavigator)
  onDateSelected(date: Date): void {
    this.selectedDate = new Date(date);
    this.filterAppointmentsByDate();
  }
  
  // Método para formatear la fecha mostrada
  getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return this.selectedDate.toLocaleDateString('es-MX', options);
  }
  
  // Verificar si la fecha seleccionada es hoy
  isToday(): boolean {
    return this.isSameDay(this.selectedDate, new Date());
  }

    // ID del menú contextual activo
  activeMenuId: number | null = null;

  // Alternar menú contextual
  toggleMenu(cita: Cita): void {
    if (this.activeMenuId === cita.id) {
      this.activeMenuId = null; // Cerrar si ya está abierto
    } else {
      this.activeMenuId = cita.id ?? null; // Abrir menú de esta cita
    }
  }

  // Cerrar menú al hacer clic fuera
  closeMenu(): void {
    this.activeMenuId = null;
  }

  // Editar cita - emitir evento al padre
  editAppointment(cita: Cita): void {
    this.activeMenuId = null;
    this.editCita.emit(cita);
  }

  // Cambiar estado de cita - emitir evento al padre
  changeStatus(cita: Cita): void {
    this.activeMenuId = null;
    this.changeStatusCita.emit(cita);
  }

  // Cambiar estado de pago - emitir evento al padre
  changePaymentStatus(cita: Cita): void {
    this.activeMenuId = null;
    this.changePaymentStatusCita.emit(cita);
  }

  // Eliminar cita
  async deleteAppointment(cita: Cita): Promise<void> {
    if (cita.id && confirm('¿Estás seguro de eliminar esta cita?')) {
      await this.appointmentService.deleteCita(cita.id);
      this.activeMenuId = null;
    }
  }

  //Obtener etiquetas
  getStatusLabel(status: string): string{
    return AppointmentStatusLabels[status as keyof typeof AppointmentStatusLabels] || status;
  }

  getPaymentStatusLabel(status: string): string{
    return PaymentStatusLabels[status as keyof typeof PaymentStatusLabels] || status;
  }
}
