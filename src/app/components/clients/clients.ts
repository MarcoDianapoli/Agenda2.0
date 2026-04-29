import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { ClientFormComponent } from '../client-form/client-form';
import { ClientHistoryComponent } from '../client-history/client-history';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientFormComponent, ClientHistoryComponent],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class ClientsComponent implements OnInit, OnDestroy {
  @Output() newAppointmentForClient = new EventEmitter<Client>();

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  showInactive: boolean = false;
  showModal: boolean = false;
  selectedClient: Client | null = null;
  activeClientsCount: number = 0;
  showHistory: boolean = false;
  selectedClientForHistory: Client | null = null;
  selectedClientForNewAppointment: Client | null = null;
  
  private subscription?: Subscription;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.subscription = this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
      this.filterClients();
      this.activeClientsCount = clients.filter(c => c.isActive).length;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  filterClients(): void {
    let filtered = this.clients;
    
    if (!this.showInactive) {
      filtered = filtered.filter(c => c.isActive);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.phone && c.phone.includes(term))
      );
    }
    
    this.filteredClients = filtered;
  }

  openNewClient(): void {
    this.selectedClient = null;
    this.showModal = true;
  }

  openEditClient(client: Client): void {
    this.selectedClient = { ...client };
    this.showModal = true;
  }

  toggleClientStatus(client: Client): void {
    if (client.isActive) {
      this.clientService.deleteClient(client.id);
    } else {
      this.clientService.restoreClient(client.id);
    }
  }

  onModalClose(): void {
    this.showModal = false;
    this.selectedClient = null;
  }

  onModalSave(client: Client): void {
    if (client.id) {
      this.clientService.updateClient(client.id, client);
    } else {
      this.clientService.addClient(client);
    }
    this.showModal = false;
    this.selectedClient = null;
  }

  getClientAppointmentsCount(clientId: number): number {
    return this.clientService.getClientAppointmentsCount(clientId);
  }

  formatDate(date?: Date): string {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  openClientHistory(client: Client): void {
    this.selectedClientForHistory = client;
    this.showHistory = true;
  }

  closeHistory(): void {
    this.showHistory = false;
    this.selectedClientForHistory = null;
  }

  onNewAppointmentFromHistory(client: Client): void {
    this.selectedClientForNewAppointment = client;
    this.showHistory = false;
    this.selectedClientForHistory = null;
    this.newAppointmentForClient.emit(client);
  }
}
