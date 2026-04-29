import { Injectable } from '@angular/core';
import { AppointmentService } from './appointment';
import { ClientService } from './client.service';
import { Cita, AppointmentStatus, PaymentStatus, AppointmentStatusLabels, PaymentStatusLabels } from '../models/appointment.model';
import { Client } from '../models/client.model';
import { FinancialSummary, DailyEarning, PaymentMethodSummary, TopClient, MonthlyComparison, StatusCount } from '../models/financial.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private appointmentService: AppointmentService,
    private clientService: ClientService
  ) {}

  getFinancialSummary(): FinancialSummary {
    const citas = this.appointmentService.getCitas();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toISOString().split('T')[0];
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    const completed = citas.filter(c => c.status === AppointmentStatus.COMPLETED);
    const pending = citas.filter(c => c.status === AppointmentStatus.PENDING || c.status === AppointmentStatus.CONFIRMED);
    const cancelled = citas.filter(c => c.status === AppointmentStatus.CANCELLED || c.status === AppointmentStatus.NO_SHOW);

    const todayAppointments = citas.filter(c => {
      const d = new Date(c.date);
      return d.toISOString().split('T')[0] === todayStr;
    });

    const weekAppointments = citas.filter(c => {
      const d = new Date(c.date);
      return d >= lastWeek && d <= today;
    });

    const monthAppointments = citas.filter(c => {
      const d = new Date(c.date);
      return d >= lastMonth && d <= today;
    });

    return {
      totalAppointments: citas.length,
      completedAppointments: completed.length,
      pendingAppointments: pending.length,
      cancelledAppointments: cancelled.length,
      totalIncome: citas.reduce((sum, c) => sum + (c.amount || 0), 0),
      totalPendingPayment: citas
        .filter(c => c.paymentStatus === PaymentStatus.PENDING || c.paymentStatus === PaymentStatus.PARTIAL)
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      totalPaid: citas
        .filter(c => c.paymentStatus === PaymentStatus.PAID)
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      todayAppointments: todayAppointments.length,
      todayIncome: todayAppointments.reduce((sum, c) => sum + (c.amount || 0), 0),
      weekAppointments: weekAppointments.length,
      weekIncome: weekAppointments.reduce((sum, c) => sum + (c.amount || 0), 0),
      monthAppointments: monthAppointments.length,
      monthIncome: monthAppointments.reduce((sum, c) => sum + (c.amount || 0), 0)
    };
  }

  getDailyEarnings(days: number): DailyEarning[] {
    const citas = this.appointmentService.getCitas();
    const result: DailyEarning[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAppointments = citas.filter(c => {
        const d = new Date(c.date);
        return d.toISOString().split('T')[0] === dateStr;
      });

      result.push({
        date: dateStr,
        total: dayAppointments.reduce((sum, c) => sum + (c.amount || 0), 0),
        count: dayAppointments.length
      });
    }

    return result;
  }

  getPaymentMethodSummary(): PaymentMethodSummary[] {
    const citas = this.appointmentService.getCitas();
    const groups: { [key: string]: { count: number; total: number } } = {};

    citas.forEach(c => {
      const status = c.paymentStatus || PaymentStatus.PENDING;
      if (!groups[status]) {
        groups[status] = { count: 0, total: 0 };
      }
      groups[status].count++;
      groups[status].total += (c.amount || 0);
    });

    return Object.entries(groups).map(([method, data]) => ({
      method: PaymentStatusLabels[method as keyof typeof PaymentStatusLabels] || method,
      count: data.count,
      total: data.total
    }));
  }

  getTopClients(limit: number): TopClient[] {
    const citas = this.appointmentService.getCitas();
    const clientGroups: { [key: number]: { count: number; total: number; lastVisit: Date | null } } = {};

    citas.forEach(c => {
      if (c.clientId) {
        if (!clientGroups[c.clientId]) {
          clientGroups[c.clientId] = { count: 0, total: 0, lastVisit: null };
        }
        clientGroups[c.clientId].count++;
        clientGroups[c.clientId].total += (c.amount || 0);
        
        const visitDate = new Date(c.date);
        if (!clientGroups[c.clientId].lastVisit || visitDate > clientGroups[c.clientId].lastVisit!) {
          clientGroups[c.clientId].lastVisit = visitDate;
        }
      }
    });

    return Object.entries(clientGroups)
      .map(([clientId, data]) => {
        const client = this.clientService.getClientById(Number(clientId));
        return {
          clientId: Number(clientId),
          clientName: client?.name || 'Cliente desconocido',
          totalAppointments: data.count,
          totalSpent: data.total,
          lastVisit: data.lastVisit
        };
      })
      .sort((a: TopClient, b: TopClient) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  getAppointmentsByStatus(): StatusCount[] {
    const citas = this.appointmentService.getCitas();
    const groups: { [key: string]: number } = {};

    citas.forEach(c => {
      if (!groups[c.status]) {
        groups[c.status] = 0;
      }
      groups[c.status]++;
    });

    const statusColors: { [key: string]: string } = {
      [AppointmentStatus.PENDING]: '#FF9800',
      [AppointmentStatus.CONFIRMED]: '#4CAF50',
      [AppointmentStatus.ARRIVED]: '#2196F3',
      [AppointmentStatus.IN_PROGRESS]: '#FFC107',
      [AppointmentStatus.COMPLETED]: '#00897B',
      [AppointmentStatus.CANCELLED]: '#F44336',
      [AppointmentStatus.NO_SHOW]: '#9E9E9E',
      [AppointmentStatus.RESCHEDULED]: '#9C27B0'
    };

    return Object.entries(groups).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#000000',
      label: AppointmentStatusLabels[status as keyof typeof AppointmentStatusLabels] || status
    }));
  }

  getMonthlyComparison(): MonthlyComparison[] {
    const citas = this.appointmentService.getCitas();
    const months: { [key: string]: { income: number } } = {};
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months[key] = { income: 0 };
    }

    // Sum income for completed appointments
    citas.forEach(c => {
      if (c.status === AppointmentStatus.COMPLETED) {
        const d = new Date(c.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (months[key]) {
          months[key].income += (c.amount || 0);
        }
      }
    });

    return Object.entries(months).map(([key, data]) => {
      const [year, month] = key.split('-').map(Number);
      const income = data.income;
      const expenses = income * 0.4; // Simulated operational expenses
      return {
        month: monthNames[month],
        income,
        expenses,
        balance: income - expenses
      };
    });
  }
}
