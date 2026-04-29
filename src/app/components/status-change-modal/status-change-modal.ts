import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita, AppointmentStatus, AppointmentStatusLabels } from '../../models/appointment.model';

@Component({
  selector: 'app-status-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './status-change-modal.html',
  styleUrl: './status-change-modal.css',
})
export class StatusChangeModal implements OnInit {
  @Input() cita!: Cita;
  @Output() close = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<{id: number, status: AppointmentStatus}>();

  selectedStatus!: AppointmentStatus;
  
  statusOptions = Object.entries(AppointmentStatusLabels).map(([value, label]) => ({
    value: value as AppointmentStatus,
    label
  }));

  ngOnInit(): void {
    this.selectedStatus = this.cita.status;
  }

  onCancel(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.cita.id) {
      this.statusChanged.emit({
        id: this.cita.id,
        status: this.selectedStatus
      });
    }
  }

  getStatusLabel(status: string): string {
    return AppointmentStatusLabels[status as keyof typeof AppointmentStatusLabels] || status;
  }
}
