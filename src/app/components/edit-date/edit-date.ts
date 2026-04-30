import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita, AppointmentStatus, PaymentStatus, AppointmentStatusLabels } from '../../models/appointment.model';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-edit-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-date.html',
  styleUrl: './edit-date.css',
})
export class EditDate implements OnInit {
  @Input() cita!: Cita;
  @Output() close = new EventEmitter<void>();

  statusOptions = Object.entries(AppointmentStatusLabels).map(([values, label]) => ({
    values,
    label
  }));

  activeClients: Client[] = [];
  selectedClientId: number | null = null;
  isSaving = false;

  formData = {
    title: '',
    description: '',
    date: '',
    time: '',
    status: AppointmentStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    amount: null as number | null,
    clientId: null as number | null
  };

  constructor(
    private clientService: ClientService,
    private appointmentService: AppointmentService
  ) {
    this.activeClients = this.clientService.getActiveClients();
  }

  ngOnInit(): void {
    if (this.cita) {
      this.formData = {
        title: this.cita.title,
        description: this.cita.description,
        date: this.formatDate(this.cita.date),
        time: this.cita.time,
        status: this.cita.status,
        paymentStatus: this.cita.paymentStatus,
        amount: this.cita.amount || null,
        clientId: this.cita.clientId || null
      };
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.title.trim()) {
      alert('El titulo es obligatorio');
      return;
    }

    this.isSaving = true;

    try {
      const [year, month, day] = this.formData.date.split('-').map(Number);
      const fechaLocal = new Date(year, month - 1, day);

      const changes: Partial<Cita> = {
        title: this.formData.title,
        description: this.formData.description,
        date: fechaLocal,
        time: this.formData.time,
        status: this.formData.status,
        paymentStatus: this.formData.paymentStatus,
        amount: this.formData.amount || undefined,
        clientId: this.formData.clientId || undefined
      };

      await this.appointmentService.updateCita(this.cita.id!, changes);
      this.close.emit();
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      alert('Error al actualizar la cita. Por favor intenta de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
