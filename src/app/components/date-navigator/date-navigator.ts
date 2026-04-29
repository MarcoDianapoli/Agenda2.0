import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-navigator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-navigator.html',
  styleUrl: './date-navigator.css',
})
export class DateNavigatorComponent {
  @Input() date: Date = new Date();
  @Output() dateChange = new EventEmitter<Date>();

  goToPreviousDay(): void {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() - 1);
    this.dateChange.emit(newDate);
  }

  goToNextDay(): void {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() + 1);
    this.dateChange.emit(newDate);
  }

  get isToday(): boolean {
    const today = new Date();
    return (
      this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear()
    );
  }

  get formattedDate(): string {
    return this.date.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
