import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig, DEFAULT_CONFIG } from '../../models/app-config.model';

const STORAGE_KEY = 'agenda_config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = DEFAULT_CONFIG;
  private configSubject = new BehaviorSubject<AppConfig>(DEFAULT_CONFIG);
  public config$: Observable<AppConfig> = this.configSubject.asObservable();

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.config = { ...DEFAULT_CONFIG, ...parsed };
      } catch (e) {
        this.config = { ...DEFAULT_CONFIG };
      }
    }
    this.configSubject.next(this.config);
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  updateConfig(changes: Partial<AppConfig>): void {
    this.config = { ...this.config, ...changes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    this.configSubject.next(this.config);
    this.applyToDOM();
  }

  private applyToDOM(): void {
    const root = document.documentElement;
    
    // Aplicar fuente
    root.style.setProperty('--app-font', this.config.fontFamily);
    
    // Aplicar color de fondo
    if (this.config.backgroundImage) {
      root.style.setProperty('--app-bg', `url(${this.config.backgroundImage})`);
      root.style.setProperty('background-image', `url(${this.config.backgroundImage})`);
      root.style.setProperty('background-color', 'transparent');
    } else {
      root.style.setProperty('--app-bg', this.config.backgroundColor);
      root.style.setProperty('background-image', 'none');
      root.style.setProperty('background-color', this.config.backgroundColor);
    }
    
    // Aplicar color de header y menú lateral
    root.style.setProperty('--header-bg', this.config.headerColor);
    root.style.setProperty('--menu-bg', this.config.headerColor);
  }

  applyInitialConfig(): void {
    this.applyToDOM();
  }
}
