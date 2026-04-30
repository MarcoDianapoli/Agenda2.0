import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'calendar', loadComponent: () => import('./components/calendar-view/calendar-view').then(m => m.CalendarViewComponent) },
  { path: 'clients', loadComponent: () => import('./components/clients/clients').then(m => m.ClientsComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'settings', loadComponent: () => import('./components/settings/settings').then(m => m.SettingsComponent) },
  { path: '**', redirectTo: '/calendar' }
];
