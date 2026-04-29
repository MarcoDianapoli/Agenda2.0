import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config/config.service';
import { AppConfig, FONT_OPTIONS } from '../../models/app-config.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent implements OnInit {
  config: AppConfig;
  fontOptions = FONT_OPTIONS;
  previewImage: string | null = null;

  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }

  ngOnInit(): void {
    this.previewImage = this.config.backgroundImage;
  }

  onAppNameChange(): void {
    this.configService.updateConfig({ appName: this.config.appName });
  }

  onHeaderColorChange(): void {
    this.configService.updateConfig({ headerColor: this.config.headerColor });
  }

  onFontChange(): void {
    this.configService.updateConfig({ fontFamily: this.config.fontFamily });
  }

  onBgColorChange(): void {
    this.configService.updateConfig({ 
      backgroundColor: this.config.backgroundColor,
      backgroundImage: null 
    });
    this.previewImage = null;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        this.previewImage = imageUrl;
        this.configService.updateConfig({ 
          backgroundImage: imageUrl,
          backgroundColor: '#f5f5f5' 
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.previewImage = null;
    this.configService.updateConfig({ 
      backgroundImage: null,
      backgroundColor: this.config.backgroundColor 
    });
  }

  resetToDefaults(): void {
    localStorage.removeItem('agenda_config');
    location.reload();
  }
}
