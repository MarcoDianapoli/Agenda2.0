import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() appName: string = 'Agenda Personal';
  @Output() menuToggle = new EventEmitter<void>();

  onMenuClick(): void {
    this.menuToggle.emit();
  }
}
