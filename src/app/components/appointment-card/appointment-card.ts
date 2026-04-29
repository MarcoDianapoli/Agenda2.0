import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita, AppointmentStatusLabels, PaymentStatusLabels } from '../../models/appointment.model';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-card.html',
  styleUrl: './appointment-card.css',
})
export class AppointmentCardComponent {
  @Input() cita!: Cita;
  @Output() edit = new EventEmitter<Cita>();
  @Output() delete = new EventEmitter<Cita>();
  @Output() statusChange = new EventEmitter<Cita>();
  @Output() paymentStatusChange = new EventEmitter<Cita>();

  activeMenuId: number | null = null;
  clientName: string = '';

  constructor(private clientService: ClientService) {
    // We'll get client name reactively if needed
  }

  getClientName(): string {
    if (this.cita.clientId) {
      const client = this.clientService.getClientById(this.cita.clientId);
      return client ? client.name : '';
    }
    return '';
  }

  getStatusLabel(status: string): string {
    return AppointmentStatusLabels[status as keyof typeof AppointmentStatusLabels] || status;
  }

  getPaymentStatusLabel(status: string): string {
    return PaymentStatusLabels[status as keyof typeof PaymentStatusLabels] || status;
  }

  toggleMenu(): void {
    if (this.activeMenuId === this.cita.id) {
      this.activeMenuId = null;
    } else {
      this.activeMenuId = this.cita.id ?? null;
    }
  }

  onEdit(): void {
    this.edit.emit(this.cita);
    this.activeMenuId = null;
  }

  onChangeStatus(): void {
    this.statusChange.emit(this.cita);
    this.activeMenuId = null;
  }

  onChangePaymentStatus(): void {
    this.paymentStatusChange.emit(this.cita);
    this.activeMenuId = null;
  }

  onDelete(): void {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      this.delete.emit(this.cita);
    }
    this.activeMenuId = null;
  }

  getColorForStatus(): string {
    return this.cita.color || '#4CAF50';
  }
}
