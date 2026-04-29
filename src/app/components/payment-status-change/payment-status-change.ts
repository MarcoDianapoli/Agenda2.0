import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita, PaymentStatus, PaymentStatusLabels } from '../../models/appointment.model';

@Component({
  selector: 'app-payment-status-change',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-status-change.html',
  styleUrl: './payment-status-change.css',
})
export class PaymentStatusChange implements OnInit {
  @Input() cita!: Cita;
  @Output() close = new EventEmitter<void>();
  @Output() paymentStatusChanged = new EventEmitter<{id: number, paymentStatus: PaymentStatus, paidAmount?: number}>();

  selectedPaymentStatus!: PaymentStatus;
  paidAmount: number | null = null;
  
  paymentStatusOptions = Object.entries(PaymentStatusLabels).map(([value, label]) => ({
    value: value as PaymentStatus,
    label
  }));

  ngOnInit(): void {
    this.selectedPaymentStatus = this.cita.paymentStatus;
    this.paidAmount = this.cita.paidAmount || null;
  }

  // Verificar si se debe mostrar el campo de monto pagado
  shouldShowPaidAmount(): boolean {
    return this.selectedPaymentStatus === PaymentStatus.PAID || 
           this.selectedPaymentStatus === PaymentStatus.PARTIAL;
  }

  onCancel(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.cita.id) {
      const updateData: any = {
        id: this.cita.id,
        paymentStatus: this.selectedPaymentStatus
      };
      
      // Solo agregar paidAmount si el estado es PAGADO o PARCIAL
      if (this.shouldShowPaidAmount() && this.paidAmount) {
        updateData.paidAmount = this.paidAmount;
      } else if (this.selectedPaymentStatus === PaymentStatus.REFUNDED) {
        updateData.paidAmount = 0;
      } else {
        updateData.paidAmount = undefined;
      }
      
      this.paymentStatusChanged.emit(updateData);
    }
  }

  getPaymentStatusLabel(status: string): string {
    return PaymentStatusLabels[status as keyof typeof PaymentStatusLabels] || status;
  }
}
