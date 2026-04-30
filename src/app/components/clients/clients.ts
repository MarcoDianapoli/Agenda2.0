import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  clientAppointmentsCount: Map<number, number> = new Map();
  loading = true;
  
  private subscription?: Subscription;

  constructor(private clientService: ClientService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Load initial data with Promise and force change detection
    this.clientService.getClientsPromise()
      .then(data => {
        console.log('Clientes cargados:', data);
        this.clients = data || [];
        this.filteredClients = [...this.clients];
        this.filterClients();
        this.activeClientsCount = data.filter(c => c.isActive).length;
        this.loadAppointmentCounts(data);
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading establecido a false');
      })
      .catch(error => {
        console.error('Error al cargar clientes:', error);
        this.clients = [];
        this.filteredClients = [];
        this.loading = false;
        this.cdr.detectChanges();
      });

    // Subscribe for future reactive updates
    this.subscription = this.clientService.getClients().subscribe(clients => {
      console.log('Clientes actualizados via Observable:', clients);
      this.clients = clients;
      this.filterClients();
      this.activeClientsCount = clients.filter(c => c.isActive).length;
      this.loadAppointmentCounts(clients);
    });
  }

  private async loadAppointmentCounts(clients: Client[]): Promise<void> {
    this.clientAppointmentsCount.clear();
    const clientIds = clients.map(c => c.id);
    const counts = await this.clientService.getAppointmentCountsByClientIds(clientIds);
    counts.forEach((count, clientId) => {
      this.clientAppointmentsCount.set(clientId, count);
    });
    this.cdr.detectChanges();
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

  async toggleClientStatus(client: Client): Promise<void> {
    if (client.isActive) {
      await this.clientService.deleteClient(client.id);
    } else {
      await this.clientService.restoreClient(client.id);
    }
  }

  onModalClose(): void {
    this.showModal = false;
    this.selectedClient = null;
  }

  onModalClosed(): void {
    this.showModal = false;
    this.selectedClient = null;
  }

  getClientAppointmentsCount(clientId: number): number {
    return this.clientAppointmentsCount.get(clientId) || 0;
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
