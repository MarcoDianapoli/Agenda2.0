import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, CLIENT_COLORS } from '../models/client.model';
import { supabase } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients: Client[] = [];
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  
  constructor() {
    this.loadClients();
  }

  getClients(): Observable<Client[]> {
    return this.clientsSubject.asObservable();
  }

  // Método para obtener clientes como Promise (para usar con async/await)
  async getClientsPromise(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error Supabase:', error);
      throw error;
    }
    
    const clients = (data || []).map(this.mapFromSupabase);
    this.clients = clients;
    this.clientsSubject.next([...this.clients]);
    return clients;
  }

  getClientById(id: number): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  getActiveClients(): Client[] {
    return this.clients.filter(c => c.isActive);
  }

  // Cargar clientes desde Supabase
  private async loadClients(): Promise<void> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error loading clients:', error);
      return;
    }
    
    this.clients = (data || []).map(this.mapFromSupabase);
    this.clientsSubject.next([...this.clients]);
  }

  // Notificar cambios recargando desde Supabase
  private async notifyChanges(): Promise<void> {
    await this.loadClients();
  }

  // Mapear de snake_case (Supabase) a camelCase (modelo)
  private mapFromSupabase(data: any): Client {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      isActive: data.is_active,
      color: data.color,
      totalAppointments: data.total_appointments,
      lastAppointmentDate: data.last_appointment_date ? new Date(data.last_appointment_date + 'T00:00:00') : undefined,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
  }

  // Mapear de camelCase (modelo) a snake_case (Supabase)
  private mapToSupabase(client: Partial<Client>): any {
    const mapped: any = {};
    if (client.name !== undefined) mapped.name = client.name;
    if (client.email !== undefined) mapped.email = client.email;
    if (client.phone !== undefined) mapped.phone = client.phone;
    if (client.address !== undefined) mapped.address = client.address;
    if (client.notes !== undefined) mapped.notes = client.notes;
    if (client.isActive !== undefined) mapped.is_active = client.isActive;
    if (client.color !== undefined) mapped.color = client.color;
    if (client.totalAppointments !== undefined) mapped.total_appointments = client.totalAppointments;
    if (client.lastAppointmentDate !== undefined) {
      mapped.last_appointment_date = client.lastAppointmentDate instanceof Date 
        ? client.lastAppointmentDate.toISOString().split('T')[0]
        : client.lastAppointmentDate;
    }
    if (client.createdAt !== undefined) mapped.created_at = client.createdAt;
    if (client.updatedAt !== undefined) mapped.updated_at = client.updatedAt;
    return mapped;
  }

  async addClient(client: Partial<Client>): Promise<void> {
    const newClient = {
      ...client,
      isActive: true,
      color: client.color || CLIENT_COLORS[Math.floor(Math.random() * CLIENT_COLORS.length)],
      totalAppointments: 0
    };
    
    const { error } = await supabase
      .from('clients')
      .insert([this.mapToSupabase(newClient)])
      .select();
    
    if (error) {
      console.error('Error adding client:', error);
      return;
    }
    
    await this.notifyChanges();
  }

  async updateClient(id: number, changes: Partial<Client>): Promise<void> {
    const mappedChanges = this.mapToSupabase(changes);
    
    const { error } = await supabase
      .from('clients')
      .update(mappedChanges)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating client:', error);
      return;
    }
    
    await this.notifyChanges();
  }

  async deleteClient(id: number): Promise<void> {
    await this.updateClient(id, { isActive: false });
  }

  async restoreClient(id: number): Promise<void> {
    await this.updateClient(id, { isActive: true });
  }

  async getClientAppointmentsCount(clientId: number): Promise<number> {
    const { count, error } = await supabase
      .from('citas')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);
    
    if (error) {
      console.error('Error counting appointments for client', clientId, ':', error);
      return 0;
    }
    
    return count || 0;
  }

  // Obtener conteos de citas para múltiples clientes en una sola consulta
  async getAppointmentCountsByClientIds(clientIds: number[]): Promise<Map<number, number>> {
    const counts = new Map<number, number>();
    
    if (clientIds.length === 0) return counts;
    
    const { data, error } = await supabase
      .from('citas')
      .select('client_id')
      .in('client_id', clientIds);
    
    if (error) {
      console.error('Error counting appointments:', error);
      return counts;
    }
    
    // Contar ocurrencias por client_id
    const countMap: { [key: number]: number } = {};
    (data || []).forEach((row: any) => {
      countMap[row.client_id] = (countMap[row.client_id] || 0) + 1;
    });
    
    // Convertir a Map
    Object.entries(countMap).forEach(([clientId, count]) => {
      counts.set(Number(clientId), count);
    });
    
    return counts;
  }
}
