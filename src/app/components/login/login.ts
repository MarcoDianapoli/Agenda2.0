import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onLogin(): void {
    this.errorMessage = '';
    
    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const success = this.authService.login({
        email: this.email,
        password: this.password
      });

      if (!success) {
        this.errorMessage = 'Correo o contrasena incorrectos';
        this.isLoading = false;
      }
    }, 500);
  }
}
