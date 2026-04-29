import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita, AppointmentStatus, PaymentStatus, AppointmentStatusLabels } from '../../models/appointment.model';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-new-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-date.html',
  styleUrl: './new-date.css',
})
export class NewDate {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Cita>();
  @Input() selectedDate: Date = new Date();
  @Input() preselectedClient: Client | null = null;

  statusOptions = Object.entries(AppointmentStatusLabels).map(([values, label]) =>
  ({
    values,label
  }));

  activeClients: Client[] = [];
  selectedClientId: number | null = null;

  constructor(private clientService: ClientService) {
    this.activeClients = this.clientService.getActiveClients();
  }

  ngOnInit(): void {
    if (this.preselectedClient) {
      this.formData.clientId = this.preselectedClient.id;
    }
  }

  private formatDate(date: Date): string{
    // Usar componentes locales para evitar problemas de zona horaria
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formData={
    title: '',
    description: '',
    date: this.formatDate(new Date()),
    time: '12:00',
    status: AppointmentStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    amount: null as number | null,
    clientId: null as number | null
  };

  onSubmit(): void{
    if(!this.formData.title.trim()){
      alert('El titulo es obligatorio');
      return;
    }
    // Parsear la fecha correctamente preservando la fecha local
    const [year, month, day] = this.formData.date.split('-').map(Number);
    const fechaLocal = new Date(year, month - 1, day);
    
    const nuevaCita: Cita = {
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
    this.save.emit(nuevaCita);
  };
  
  private getColorForStatus(status: AppointmentStatus):string{
    const colors: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: '#FF9800',
      [AppointmentStatus.CONFIRMED]: '#4CAF50',
      [AppointmentStatus.ARRIVED]: '#2196F3',
      [AppointmentStatus.IN_PROGRESS]: '#FFC107',
      [AppointmentStatus.COMPLETED]: '#00897B',  // ← Cambiado
      [AppointmentStatus.CANCELLED]: '#F44336',
      [AppointmentStatus.NO_SHOW]: '#9E9E9E',
      [AppointmentStatus.RESCHEDULED]: '#9C27B0'
    };
      return colors[status] || '#000000';
  }


  onCancel(): void{
    this.close.emit();
  }

}
