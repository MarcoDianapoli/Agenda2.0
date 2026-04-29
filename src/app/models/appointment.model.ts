// Status de la cita 
export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    ARRIVED = 'arrived',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
    RESCHEDULED = 'rescheduled'
}

// Status del pago de la cita
export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PARTIAL = 'partial',
    NO_CHARGE = 'no_charge',
    COURTESY = 'courtesy',
    WAIVED = 'waived',
    REFUNDED = 'refunded'
}

export interface Cita {
    id?: number;
    title: string;
    description: string;
    date: Date;
    time: string;
    status: AppointmentStatus;
    paymentStatus: PaymentStatus;
    amount?: number;
    paidAmount?: number;
    clientId?: number;
    color?: string;
}

export const APPOINTMENT_COLORS: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: '#FF9800',
    [AppointmentStatus.CONFIRMED]: '#4CAF50',
    [AppointmentStatus.ARRIVED]: '#2196F3',
    [AppointmentStatus.IN_PROGRESS]: '#FFC107',
    [AppointmentStatus.COMPLETED]: '#00897B',  // ← Cambiado
    [AppointmentStatus.CANCELLED]: '#F44336',
    [AppointmentStatus.NO_SHOW]: '#9E9E9E',
    [AppointmentStatus.RESCHEDULED]: '#9C27B0'
}

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'Pendiente',
    [AppointmentStatus.CONFIRMED]: 'Confirmada',
    [AppointmentStatus.ARRIVED]: 'Llegada',
    [AppointmentStatus.IN_PROGRESS]: 'En Progreso',
    [AppointmentStatus.COMPLETED]: 'Completada',
    [AppointmentStatus.CANCELLED]: 'Cancelada',
    [AppointmentStatus.NO_SHOW]: 'No Asistió',
    [AppointmentStatus.RESCHEDULED]: 'Reprogramada'
}

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Pendiente',
    [PaymentStatus.PAID]: 'Pagado',
    [PaymentStatus.PARTIAL]: 'Pago Parcial',
    [PaymentStatus.NO_CHARGE]: 'Sin Cargo',
    [PaymentStatus.COURTESY]: 'Cortesía',
    [PaymentStatus.WAIVED]: 'Exento',
    [PaymentStatus.REFUNDED]: 'Reembolsado'
}