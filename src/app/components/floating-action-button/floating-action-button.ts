import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-floating-action-button',
  standalone: true,
  imports: [CommonModule],
  template: 
  `<button class="fab" (click)="onClick()" title= "Nueva Cita">
    <span class="fab-icon">+</span>
  </button>`,
  styles: [`
    .fab{
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #4CAF50;
        color: white;
        border: none;
        font-size: 28px;
        font-family: 'Roboto', sans-serif;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
      }
    .fab:hover {
        transform: scale(1.1);      /* Aumenta tamaño al 110% */
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      }
    .fab-icon {
        line-height: 1;          /* Altura de línea normal */
        font-weight: bold;       /* Negrita */
    }
  `],
})

export class FloatingActionButton {
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    // Emite el evento. El componente padre lo recibe y ejecuta su propia lógica
    this.clicked.emit();
  }
}
