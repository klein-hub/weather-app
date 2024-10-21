import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HourlyForecastComponent } from './hourly-forecast.component';
import { WeatherService } from './weather.service';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, HourlyForecastComponent],
  template: `
    <mat-card *ngIf="weatherData; else loading">
      <mat-card-header>
        <mat-card-title>{{ weatherData.city }}</mat-card-title>
        <mat-card-subtitle>{{ weatherData.description }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="weather-details">
          <div class="temperature">
            <img [src]="weatherData.icon" alt="Weather icon">
            {{ weatherData.temperature | number:'1.0-0' }}°C
          </div>
          <div>
            <mat-icon>opacity</mat-icon>
            Humidity: {{ weatherData.humidity }}%
          </div>
          <div>
            <mat-icon>air</mat-icon>
            Wind Speed: {{ weatherData.windSpeed | number:'1.0-1' }} m/s
          </div>
        </div>
      </mat-card-content>
    </mat-card>
    <ng-template #loading>
      <mat-card>
        <mat-card-content>
          <div class="loading-spinner">
            <mat-spinner></mat-spinner>
          </div>
        </mat-card-content>
      </mat-card>
    </ng-template>
    <app-hourly-forecast [forecast]="hourlyForecast"></app-hourly-forecast>
  `,
  styles: [`
    mat-card {
      margin-bottom: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .weather-details {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }
    .temperature {
      font-size: 2em;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
    .temperature img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    mat-icon {
      vertical-align: middle;
      margin-right: 8px;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
  `]
})
export class WeatherComponent implements OnChanges {
  @Input() city: string = 'New York';
  weatherData: WeatherData | null = null;
  hourlyForecast: any[] = [];

  constructor(private weatherService: WeatherService, private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['city']) {
      this.fetchWeatherData();
    }
  }

  fetchWeatherData() {
    this.weatherData = null;
    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = {
          city: data.current.name,
          temperature: data.current.main.temp,
          description: data.current.weather[0].description,
          humidity: data.current.main.humidity,
          windSpeed: data.current.wind.speed,
          icon: data.current.weather[0].icon
        };
        this.hourlyForecast = data.forecast;
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
        this.snackBar.open('Failed to fetch weather data. Please try again later.', 'Close', {
          duration: 5000,
        });
      }
    });
  }
}