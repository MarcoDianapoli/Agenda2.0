import { Injectable } from '@angular/core';
import {Cita , AppointmentStatus, PaymentStatus} from '../models/appointment.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { supabase } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  // Arreglo principal de citas
  private appointments: Cita[] = [];
  
  // Subject para reactividad
  private appointmentsSubject = new BehaviorSubject<Cita[]>([]);
  
  // Observable público
  public appointments$: Observable<Cita[]> = this.appointmentsSubject.asObservable();
  
  constructor() {
    this.loadAppointments();
  }
  
  // Cargar citas desde Supabase
  private async loadAppointments(): Promise<void> {
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error loading appointments:', error);
      return;
    }
    
    this.appointments = (data || []).map(this.mapFromSupabase);
    this.appointmentsSubject.next([...this.appointments]);
  }
  
  // Notificar cambios recargando desde Supabase
  private async notifyChanges(): Promise<void> {
    await this.loadAppointments();
  }
  
  // Mapear de snake_case (Supabase) a camelCase (modelo)
  private mapFromSupabase(data: any): Cita {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      date: new Date(data.date + 'T00:00:00'),
      time: data.time,
      status: data.status as AppointmentStatus,
      paymentStatus: data.payment_status as PaymentStatus,
      amount: data.amount,
      paidAmount: data.paid_amount,
      clientId: data.client_id,
      color: data.color
    };
  }
  
  // Mapear de camelCase (modelo) a snake_case (Supabase)
  private mapToSupabase(cita: Partial<Cita>): any {
    const mapped: any = {};
    if (cita.title !== undefined) mapped.title = cita.title;
    if (cita.description !== undefined) mapped.description = cita.description;
    if (cita.date !== undefined) mapped.date = this.formatDate(cita.date);
    if (cita.time !== undefined) mapped.time = cita.time;
    if (cita.status !== undefined) mapped.status = cita.status;
    if (cita.paymentStatus !== undefined) mapped.payment_status = cita.paymentStatus;
    if (cita.amount !== undefined) mapped.amount = cita.amount;
    if (cita.paidAmount !== undefined) mapped.paid_amount = cita.paidAmount;
    if (cita.clientId !== undefined) mapped.client_id = cita.clientId;
    if (cita.color !== undefined) mapped.color = cita.color;
    return mapped;
  }
  
  // Formatear fecha a YYYY-MM-DD
  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Obtener todas las citas (async)
  async getCitas(): Promise<Cita[]> {
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error getting appointments:', error);
      return [];
    }
    
    return (data || []).map(this.mapFromSupabase);
  }
  
  // Obtener citas por fecha
  async getCitasByDate(date: Date): Promise<Cita[]> {
    const fechaFormateada = this.formatDate(date);
    
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .eq('date', fechaFormateada);
    
    if (error) {
      console.error('Error getting appointments by date:', error);
      return [];
    }
    
    return (data || []).map(this.mapFromSupabase);
  }
  
  // Crear nueva cita
  async addCita(cita: Partial<Cita>): Promise<void> {
    const nuevaCita = {
      ...cita,
      status: cita.status || AppointmentStatus.PENDING,
      paymentStatus: cita.paymentStatus || PaymentStatus.PENDING
    };
    
    const { error } = await supabase
      .from('citas')
      .insert([this.mapToSupabase(nuevaCita)])
      .select();
    
    if (error) {
      console.error('Error adding appointment:', error);
      return;
    }
    
    await this.notifyChanges();
  }
  
  // Actualizar cita existente
  async updateCita(id: number, changes: Partial<Cita>): Promise<void> {
    const mappedChanges = this.mapToSupabase(changes);
    
    const { error } = await supabase
      .from('citas')
      .update(mappedChanges)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating appointment:', error);
      return;
    }
    
    await this.notifyChanges();
  }
  
  // Eliminar cita
  async deleteCita(id: number): Promise<void> {
    const { error } = await supabase
      .from('citas')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      return;
    }
    
    await this.notifyChanges();
  }
}
