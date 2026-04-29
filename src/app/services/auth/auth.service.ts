import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials, STATIC_USER, STATIC_PASSWORD } from '../../models/auth.model';

const STORAGE_KEY = 'agenda_user_logged_in';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User = { ...STATIC_USER, isLoggedIn: false };
  private userSubject = new BehaviorSubject<User>(this.currentUser);
  public user$: Observable<User> = this.userSubject.asObservable();

  constructor() {
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const isLoggedIn = localStorage.getItem(STORAGE_KEY);
    if (isLoggedIn === 'true') {
      this.currentUser = { ...STATIC_USER, isLoggedIn: true };
      this.userSubject.next(this.currentUser);
    }
  }

  login(credentials: LoginCredentials): boolean {
    if (credentials.email === STATIC_USER.email && 
        credentials.password === STATIC_PASSWORD) {
      this.currentUser = { ...STATIC_USER, isLoggedIn: true };
      localStorage.setItem(STORAGE_KEY, 'true');
      this.userSubject.next(this.currentUser);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = { ...STATIC_USER, isLoggedIn: false };
    localStorage.removeItem(STORAGE_KEY);
    this.userSubject.next(this.currentUser);
  }

  isLoggedIn(): boolean {
    return this.currentUser.isLoggedIn;
  }
}
