import { Injectable } from '@angular/core';
import {Cita , AppointmentStatus, PaymentStatus} from '../models/appointment.model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  // Clave para localStorage
  private readonly STORAGE_KEY = 'agenda_citas';
  
  // Arreglo principal de citas
  private appointments: Cita[] = [];
  
  // Subject para reactividad
  private appointmentsSubject = new BehaviorSubject<Cita[]>([]);
  
  // Observable público
  public appointments$: Observable<Cita[]> = this.appointmentsSubject.asObservable();
  
  constructor() {
    this.loadFromLocalStorage();
    // Si no hay datos, crear ejemplos
    if (this.appointments.length === 0) {
      this.createSampleData();
    }
  }
  
  // Generar ID único
  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
  
  // Guardar en localStorage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.appointments));
  }
  
  // Cargar de localStorage
  private loadFromLocalStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.appointments = JSON.parse(data);
      // Convertir fechas preservando la fecha local (evitar problemas de zona horaria)
      this.appointments.forEach(cita => {
        const dateValue = cita.date as any;
        if (typeof dateValue === 'string') {
          // El formato puede ser 'YYYY-MM-DD' o ISO string
          if (dateValue.includes('T')) {
            // ISO string - extraer solo la fecha
            const [year, month, day] = dateValue.split('T')[0].split('-').map(Number);
            cita.date = new Date(year, month - 1, day);
          } else {
            // Formato YYYY-MM-DD
            const [year, month, day] = dateValue.split('-').map(Number);
            cita.date = new Date(year, month - 1, day);
          }
        } else if (dateValue instanceof Date) {
          // Ya es Date, solo asegurar que sea local
          const d = new Date(dateValue);
          cita.date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
      });
      this.appointmentsSubject.next(this.appointments);
    }
  }
  
  // Notificar cambios
  private notifyChanges(): void {
    this.appointmentsSubject.next([...this.appointments]);
    this.saveToLocalStorage();
  }
  
  // Obtener todas las citas
  getCitas(): Cita[] {
    return [...this.appointments];
  }
  
  // Obtener citas por fecha
  getCitasByDate(date: Date): Cita[] {
    return this.appointments.filter(cita => {
      const citaDate = new Date(cita.date);
      return this.isSameDay(citaDate, date);
    });
  }
  
  // Comparar si dos fechas son del mismo día
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  // Crear nueva cita
  addCita(cita: Cita): void {
    const nuevaCita: Cita = {
      ...cita,
      id: cita.id || this.generateId(),
      status: cita.status || AppointmentStatus.PENDING,
      paymentStatus: cita.paymentStatus || PaymentStatus.PENDING
    };
    this.appointments.push(nuevaCita);
    this.notifyChanges();
  }
  
  // Actualizar cita existente
  updateCita(id: number, changes: Partial<Cita>): void {
    const index = this.appointments.findIndex(c => c.id === id);
    if (index !== -1) {
      // Si se está cambiando el estado, actualizar también el color automáticamente
      if (changes.status) {
        changes = { ...changes, color: this.getColorForStatus(changes.status) };
      }
      this.appointments[index] = { ...this.appointments[index], ...changes };
      this.notifyChanges();
    }
  }

  // Obtener color basado en el estado
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
  
  // Eliminar cita
  deleteCita(id: number): void {
    this.appointments = this.appointments.filter(c => c.id !== id);
    this.notifyChanges();
  }
  
  // Datos de ejemplo
  private createSampleData(): void {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    
    const citasEjemplo: Cita[] = [
      {
        id: 1,
        title: 'María González - Consulta',
        description: 'Primera visita del año',
        date: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
        time: '10:00',
        status: AppointmentStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        amount: 500,
        color: '#4CAF50'
      },
      {
        id: 2,
        title: 'Juan Pérez - Seguimiento',
        description: 'Revisión mensual',
        date: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
        time: '14:00',
        status: AppointmentStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        color: '#FF9800'
      },
      {
        id: 3,
        title: 'Ana Martínez - Urgencia',
        description: 'Dolor agudo',
        date: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
        time: '16:30',
        status: AppointmentStatus.ARRIVED,
        paymentStatus: PaymentStatus.PAID,
        amount: 350,
        color: '#2196F3'
      },
      {
        id: 4,
        title: 'Carlos López - Tratamiento',
        description: 'Sesión completa',
        date: manana,
        time: '09:00',
        status: AppointmentStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PARTIAL,
        amount: 1200,
        paidAmount: 600,
        color: '#9C27B0'
      },
      {
        id: 5,
        title: 'Laura Sánchez - Revisión',
        description: '',
        date: ayer,
        time: '11:00',
        status: AppointmentStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        amount: 500,
        color: '#00897B'
      },
      {
        id: 6,
        title: 'Pedro Díaz - Cancelada',
        description: 'Cliente avisó con anticipación',
        date: ayer,
        time: '13:00',
        status: AppointmentStatus.CANCELLED,
        paymentStatus: PaymentStatus.NO_CHARGE,
        color: '#F44336'
      }
    ];
    
    this.appointments = citasEjemplo;
    this.notifyChanges();
  }
}