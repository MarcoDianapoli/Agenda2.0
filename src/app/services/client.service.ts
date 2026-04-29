import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, CLIENT_COLORS } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients: Client[] = [];
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  
  constructor() {
    this.loadFromLocalStorage();
    if (this.clients.length === 0) {
      this.createSampleClients();
    }
  }

  getClients(): Observable<Client[]> {
    return this.clientsSubject.asObservable();
  }

  getClientById(id: number): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  getActiveClients(): Client[] {
    return this.clients.filter(c => c.isActive);
  }

  addClient(client: Partial<Client>): void {
    const newId = Math.max(0, ...this.clients.map(c => c.id)) + 1;
    const newClient: Client = {
      id: newId,
      name: client.name || '',
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes,
      isActive: true,
      color: client.color || CLIENT_COLORS[Math.floor(Math.random() * CLIENT_COLORS.length)],
      createdAt: new Date(),
      updatedAt: new Date(),
      totalAppointments: 0
    };
    this.clients.push(newClient);
    this.saveToLocalStorage();
  }

  updateClient(id: number, changes: Partial<Client>): void {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients[index] = {
        ...this.clients[index],
        ...changes,
        updatedAt: new Date()
      };
      this.saveToLocalStorage();
    }
  }

  deleteClient(id: number): void {
    this.updateClient(id, { isActive: false });
  }

  restoreClient(id: number): void {
    this.updateClient(id, { isActive: true });
  }

  getClientAppointmentsCount(clientId: number): number {
    const appointmentsStr = localStorage.getItem('agenda_citas');
    if (!appointmentsStr) return 0;
    try {
      const appointments = JSON.parse(appointmentsStr);
      return appointments.filter((a: any) => a.clientId === clientId).length;
    } catch {
      return 0;
    }
  }

  private createSampleClients(): void {
    const sampleClients: Partial<Client>[] = [
      { name: 'María González', email: 'maria@email.com', phone: '555-0101', notes: 'Prefiere citas por la mañana' },
      { name: 'Juan Pérez', email: 'juan@email.com', phone: '555-0102', notes: 'Cliente frecuente' },
      { name: 'Ana Martínez', email: 'ana@email.com', phone: '555-0103', notes: '' },
      { name: 'Carlos López', email: 'carlos@email.com', phone: '555-0104', notes: 'Paga con tarjeta' },
      { name: 'Laura Sánchez', email: 'laura@email.com', phone: '555-0105', notes: 'Primera cita fue en enero' }
    ];

    sampleClients.forEach((client, index) => {
      const newClient: Client = {
        id: index + 1,
        name: client.name || '',
        email: client.email,
        phone: client.phone,
        address: client.address,
        notes: client.notes,
        isActive: true,
        color: CLIENT_COLORS[index],
        createdAt: new Date(),
        updatedAt: new Date(),
        totalAppointments: 0
      };
      this.clients.push(newClient);
    });
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('agenda_clients', JSON.stringify(this.clients));
    this.clientsSubject.next([...this.clients]);
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('agenda_clients');
    if (stored) {
      try {
        this.clients = JSON.parse(stored);
        this.clientsSubject.next([...this.clients]);
      } catch {
        this.clients = [];
      }
    }
  }
}
