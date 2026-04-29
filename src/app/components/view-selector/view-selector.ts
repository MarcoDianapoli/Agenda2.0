import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-selector.html',
  styleUrl: './view-selector.css',
})
export class ViewSelectorComponent {
  @Input() currentView: 'day' | 'month' | 'year' = 'day';
  @Output() viewChange = new EventEmitter<'day' | 'month' | 'year'>();

  isDropdownOpen = false;

  views: { value: 'day' | 'month' | 'year'; label: string }[] = [
    { value: 'day', label: 'Día' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' }
  ];

  getViewLabel(view: string): string {
    const found = this.views.find(v => v.value === view);
    return found ? found.label : 'Día';
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectView(view: 'day' | 'month' | 'year'): void {
    this.viewChange.emit(view);
    this.isDropdownOpen = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }
}
