import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita, AppointmentStatusLabels, PaymentStatusLabels } from '../../models/appointment.model';

@Component({
  selector: 'app-day-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-modal.html',
  styleUrl: './day-modal.css',
})
export class DayModal {
  @Input() date!: Date;
  @Input() citas: Cita[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() editCita = new EventEmitter<Cita>();
  @Output() changeStatusCita = new EventEmitter<Cita>();

  getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return this.date.toLocaleDateString('es-MX', options);
  }

  getStatusLabel(status: string): string {
    return AppointmentStatusLabels[status as keyof typeof AppointmentStatusLabels] || status;
  }

  getPaymentStatusLabel(status: string): string {
    return PaymentStatusLabels[status as keyof typeof PaymentStatusLabels] || status;
  }

  onEdit(cita: Cita): void {
    this.editCita.emit(cita);
  }

  onChangeStatus(cita: Cita): void {
    this.changeStatusCita.emit(cita);
  }

  onDelete(cita: Cita): void {
    if (cita.id && confirm('¿Estás seguro de eliminar esta cita?')) {
      // Necesitamos el servicio, pero por ahora emitimos
      this.changeStatusCita.emit({ ...cita, delete: true } as any);
    }
  }

  getColorForStatus(status: string): string {
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
}
