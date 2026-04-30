import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, CLIENT_COLORS } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
})
export class ClientFormComponent implements OnInit {
  @Input() client: Client | null = null;
  @Output() close = new EventEmitter<void>();

  formData: Partial<Client> = {
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    color: CLIENT_COLORS[Math.floor(Math.random() * CLIENT_COLORS.length)]
  };

  colors: string[] = CLIENT_COLORS;
  isEditMode = false;
  isSaving = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    if (this.client) {
      this.isEditMode = true;
      this.formData = { ...this.client };
    }
  }

  selectColor(color: string): void {
    this.formData.color = color;
  }

  isValidEmail(email?: string): boolean {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async onSave(): Promise<void> {
    if (!this.formData.name?.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (!this.isValidEmail(this.formData.email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    this.isSaving = true;

    try {
      if (this.isEditMode && this.client?.id) {
        await this.clientService.updateClient(this.client.id, this.formData);
      } else {
        await this.clientService.addClient(this.formData);
      }
      this.close.emit();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Error al guardar el cliente. Por favor intenta de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
