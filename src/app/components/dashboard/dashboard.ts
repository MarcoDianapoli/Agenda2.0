import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { FinancialSummary, DailyEarning, PaymentMethodSummary, TopClient, MonthlyComparison, StatusCount } from '../../models/financial.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  summary!: FinancialSummary;
  dailyEarnings: DailyEarning[] = [];
  paymentMethods: PaymentMethodSummary[] = [];
  topClients: TopClient[] = [];
  statusCounts: StatusCount[] = [];
  monthlyComparison: MonthlyComparison[] = [];

  maxDailyTotal = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.summary = await this.dashboardService.getFinancialSummary();
    this.dailyEarnings = await this.dashboardService.getDailyEarnings(7);
    this.paymentMethods = await this.dashboardService.getPaymentMethodSummary();
    this.topClients = await this.dashboardService.getTopClients(5);
    this.statusCounts = await this.dashboardService.getAppointmentsByStatus();
    this.monthlyComparison = await this.dashboardService.getMonthlyComparison();
    
    this.maxDailyTotal = Math.max(...this.dailyEarnings.map(d => d.total), 1);
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  getBarHeight(total: number): number {
    return Math.max((total / this.maxDailyTotal) * 180, 4);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  getMonthName(month: string): string {
    return month;
  }

  isPositiveBalance(balance: number): boolean {
    return balance >= 0;
  }
}
