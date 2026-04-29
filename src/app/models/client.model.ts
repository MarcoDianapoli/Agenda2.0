export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  totalAppointments?: number;
  lastAppointmentDate?: Date;
  isActive: boolean;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CLIENT_COLORS: string[] = [
  '#4CAF50', '#2196F3', '#F44336', '#FF9800', '#9C27B0',
  '#00BCD4', '#FFEB3B', '#795548', '#607D8B', '#E91E63'
];
