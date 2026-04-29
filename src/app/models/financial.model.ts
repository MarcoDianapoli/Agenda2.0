export interface FinancialSummary {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalIncome: number;
  totalPendingPayment: number;
  totalPaid: number;
  todayAppointments: number;
  todayIncome: number;
  weekAppointments: number;
  weekIncome: number;
  monthAppointments: number;
  monthIncome: number;
}

export interface DailyEarning {
  date: string;
  total: number;
  count: number;
}

export interface PaymentMethodSummary {
  method: string;
  count: number;
  total: number;
}

export interface TopClient {
  clientId: number;
  clientName: string;
  totalAppointments: number;
  totalSpent: number;
  lastVisit: Date | null;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface StatusCount {
  status: string;
  count: number;
  color: string;
  label: string;
}
