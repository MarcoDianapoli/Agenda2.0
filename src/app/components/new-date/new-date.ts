import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita, AppointmentStatus, PaymentStatus, AppointmentStatusLabels } from '../../models/appointment.model';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-new-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-date.html',
  styleUrl: './new-date.css',
})
export class NewDate implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() selectedDate: Date = new Date();
  @Input() preselectedClient: Client | null = null;

  statusOptions = Object.entries(AppointmentStatusLabels).map(([values, label]) =>
  ({
    values,label
  }));

  activeClients: Client[] = [];
  isSaving = false;

  constructor(
    private clientService: ClientService,
    private appointmentService: AppointmentService
  ) {
    this.activeClients = this.clientService.getActiveClients();
  }

  ngOnInit(): void {
    if (this.preselectedClient) {
      this.formData.clientId = this.preselectedClient.id;
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formData = {
    title: '',
    description: '',
    date: this.formatDate(new Date()),
    time: '12:00',
    status: AppointmentStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    amount: null as number | null,
    clientId: null as number | null
  };

  async onSubmit(): Promise<void> {
    if (!this.formData.title.trim()) {
      alert('El titulo es obligatorio');
      return;
    }

    this.isSaving = true;

    try {
      const [year, month, day] = this.formData.date.split('-').map(Number);
      const fechaLocal = new Date(year, month - 1, day);

      const nuevaCita: Partial<Cita> = {
        title: this.formData.title,
        description: this.formData.description,
        date: fechaLocal,
        time: this.formData.time,
        status: this.formData.status,
        paymentStatus: this.formData.paymentStatus,
        amount: this.formData.amount || undefined,
        color: this.getColorForStatus(this.formData.status),
        clientId: this.formData.clientId || undefined
      };

      await this.appointmentService.addCita(nuevaCita);
      this.close.emit();
    } catch (error) {
      console.error('Error al guardar cita:', error);
      alert('Error al guardar la cita. Por favor intenta de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }

  private getColorForStatus(status: AppointmentStatus): string {
    const colors: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: '#FF9800',
      [AppointmentStatus.CONFIRMED]: '#4CAF50',
      [AppointmentStatus.ARRIVED]: '#2196F3',
      [AppointmentStatus.IN_PROGRESS]: '#FFC107',
      [AppointmentStatus.COMPLETED]: '#00897B',
      [AppointmentStatus.CANCELLED]: '#F44336',
      [AppointmentStatus.NO_SHOW]: '#9E9E9E',
      [AppointmentStatus.RESCHEDULED]: '#9C27B0'
    };
    return colors[status] || '#000000';
  }

  onCancel(): void {
    this.close.emit();
  }
}
