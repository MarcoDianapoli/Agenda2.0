// =============================================
// IMPORTACIONES
// =============================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes que se usarán en el template
import { CalendarViewComponent } from './components/calendar-view/calendar-view';
import { Header } from './components/header/header';
import { FloatingActionButton } from './components/floating-action-button/floating-action-button';
import { NewDate } from './components/new-date/new-date';
import { StatusChangeModal } from './components/status-change-modal/status-change-modal';
import { PaymentStatusChange } from './components/payment-status-change/payment-status-change';
import { EditDate } from './components/edit-date/edit-date';
import { YearViewComponent } from './components/year-view/year-view';
import { MonthViewComponent } from './components/month-view/month-view';
import { DayModal } from './components/day-modal/day-modal';
import { SettingsComponent } from './components/settings/settings';
import { LoginComponent } from './components/login/login';
import { ClientsComponent } from './components/clients/clients';
import { DashboardComponent } from './components/dashboard/dashboard';
import { Client } from './models/client.model';

// Servicios
import { AppointmentService } from './services/appointment';
import { ConfigService } from './services/config/config.service';
import { AuthService } from './services/auth/auth.service';

// Modelo de datos
import { Cita } from './models/appointment.model';


// =============================================
// DECORADOR @Component (COMPONENTE RAÍZ)
// =============================================
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CalendarViewComponent,       // Vista principal de la agenda
    Header,                      // Barra superior
    FloatingActionButton,        // Botón +
    NewDate,                     // Modal de nueva cita
    StatusChangeModal,           // Modal para cambiar estado
    PaymentStatusChange,         // Modal para cambiar estado de pago
    EditDate,                    // Modal para editar cita
    YearViewComponent,           // Vista anual
    MonthViewComponent,          // Vista mensual
    DayModal,                    // Modal de día
    SettingsComponent,           // Configuración
    LoginComponent,              // Login
    ClientsComponent,            // Clientes
    DashboardComponent           // Dashboard financiero
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


// =============================================
// CLASE DEL COMPONENTE PRINCIPAL
// =============================================
export class App {
  
  // Controla la vista actual
  currentView: 'home' | 'calendar' | 'settings' | 'clients' | 'dashboard' = 'home';
  
  // Controla si el modal de nueva cita está visible
  showNewAppointmentForm = false;
  
  // Controla si el modal de cambio de estado está visible
  showStatusChangeModal = false;
  
  // Controla si el modal de cambio de estado de pago está visible
  showPaymentStatusModal = false;
  
  // Controla si el modal de edición está visible
  showEditModal = false;
  
  // Vista de calendario - mes seleccionado
  selectedMonth: number | null = null;
  
  // Vista de día - modal
  showDayModal = false;
  selectedDate: Date | null = null;
  citasForSelectedDate: Cita[] = [];
  
  // Controla si el menú lateral está visible
  showSideMenu = false;
  
   // Cita seleccionada para cambiar estado o editar
   selectedCita: Cita | null = null;

   // Cliente preseleccionado para nueva cita
   clientForNewAppointment: Client | null = null;

   // Nombre de la app (se actualiza desde configuración)
  appName = 'Agenda Personal';
  
  // Controla si el usuario está logueado
  isLoggedIn = false;
  
  // Inyecta los servicios en el constructor
  constructor(
    private appointmentService: AppointmentService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    // Aplicar configuración inicial
    this.configService.applyInitialConfig();
    
    // Suscribirse a cambios de configuración
    this.configService.config$.subscribe(config => {
      this.appName = config.appName;
    });

    // Suscribirse al estado de autenticación
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = user.isLoggedIn;
    });
  }

  getSelectedYear(): number {
    return new Date().getFullYear();
  }

  onLogout(): void {
    this.authService.logout();
    this.currentView = 'home';
  }

  // ========== MENÚ LATERAL ==========
  onMenuToggle(): void {
    this.showSideMenu = !this.showSideMenu;
  }
  
  closeSideMenu(): void {
    this.showSideMenu = false;
  }
  
  navigateTo(view: 'home' | 'calendar' | 'settings' | 'clients' | 'dashboard'): void {
    this.currentView = view;
    this.selectedMonth = null; // Reset mes al navegar
    this.closeSideMenu();
  }
  
  // ========== CALENDARIO ==========
  onMonthSelected(month: number): void {
    this.selectedMonth = month;
  }
  
   async onDaySelected(date: Date): Promise<void> {
     this.selectedDate = date;
     // Obtener citas para esta fecha
     this.citasForSelectedDate = await this.appointmentService.getCitasByDate(date);
     this.showDayModal = true;
   }
  
  closeDayModal(): void {
    this.showDayModal = false;
    this.selectedDate = null;
    this.citasForSelectedDate = [];
  }
  
   // ========== NUEVA CITA ==========
   openNewAppointmentForm(): void {
     this.clientForNewAppointment = null;
     this.showNewAppointmentForm = true;
   }
   
   closeNewAppointmentForm(): void {
     this.showNewAppointmentForm = false;
     this.clientForNewAppointment = null;
   }
   
    async saveNewAppointment(cita: Cita): Promise<void> {
      await this.appointmentService.addCita(cita);
      this.closeNewAppointmentForm();
    }

   // ========== NUEVA CITA DESDE CLIENTE ==========
   onNewAppointmentForClient(client: Client): void {
     this.clientForNewAppointment = client;
     this.showNewAppointmentForm = true;
   }
  
  // ========== CAMBIAR ESTADO ==========
  onCitaStatusChange(cita: Cita): void {
    this.selectedCita = cita;
    this.showStatusChangeModal = true;
  }
  
  closeStatusChangeModal(): void {
    this.showStatusChangeModal = false;
    this.selectedCita = null;
  }
  
   async onStatusChanged(event: {id: number, status: any}): Promise<void> {
     await this.appointmentService.updateCita(event.id, { status: event.status });
     this.closeStatusChangeModal();
   }
  
  // ========== CAMBIAR ESTADO DE PAGO ==========
  onCitaPaymentStatusChange(cita: Cita): void {
    this.selectedCita = cita;
    this.showPaymentStatusModal = true;
  }
  
  closePaymentStatusModal(): void {
    this.showPaymentStatusModal = false;
    this.selectedCita = null;
  }
  
   async onPaymentStatusChanged(event: {id: number, paymentStatus: any, paidAmount?: number}): Promise<void> {
     const updateData: any = { paymentStatus: event.paymentStatus };
     
     if (event.paidAmount !== undefined) {
       updateData.paidAmount = event.paidAmount;
     }
     
     await this.appointmentService.updateCita(event.id, updateData);
     this.closePaymentStatusModal();
   }
  
  // ========== EDITAR CITA ==========
  onEditCita(cita: Cita): void {
    this.selectedCita = cita;
    this.showEditModal = true;
  }
  
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCita = null;
  }
  
   async onSaveEditedCita(cita: Cita): Promise<void> {
     if (cita.id) {
       await this.appointmentService.updateCita(cita.id, cita);
     }
     this.closeEditModal();
   }
}
