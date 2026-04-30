import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client.model';
import { Cita, AppointmentStatusLabels } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-history.html',
  styleUrl: './client-history.css',
})
export class ClientHistoryComponent implements OnInit {
  @Input() client!: Client;
  @Output() close = new EventEmitter<void>();
  @Output() newAppointment = new EventEmitter<Client>();

  appointments: Cita[] = [];

  constructor(private appointmentService: AppointmentService) {}

  async ngOnInit(): Promise<void> {
    const citas = await this.appointmentService.getCitas();
    this.appointments = citas
      .filter((c: Cita) => c.clientId === this.client.id)
      .sort((a: Cita, b: Cita) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Most recent first
      });
  }

  createNewAppointment(): void {
    this.newAppointment.emit(this.client);
    this.close.emit();
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time || '';
  }

  getStatusLabel(status: string): string {
    return AppointmentStatusLabels[status as keyof typeof AppointmentStatusLabels] || status;
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
}
