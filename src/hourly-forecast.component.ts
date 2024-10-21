import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="forecast-card" *ngIf="forecast.length > 0">
      <mat-card-header>
        <mat-card-title>Hourly Forecast</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="carousel-container">
          <button mat-icon-button class="nav-button prev" (click)="scroll(-1)" [disabled]="atStart">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <div class="forecast-container" #forecastContainer>
            <div *ngFor="let item of forecast" class="forecast-item">
              <div class="time">{{ item.dt_txt | date:'HH:mm' }}</div>
              <img [src]="'https:' + item.weather[0].icon" alt="Weather icon">
              <div class="temperature">{{ item.main.temp | number:'1.0-0' }}°C</div>
            </div>
          </div>
          <button mat-icon-button class="nav-button next" (click)="scroll(1)" [disabled]="atEnd">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .forecast-card {
      margin-top: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .carousel-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    .forecast-container {
      display: flex;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 10px 0;
    }
    .forecast-container::-webkit-scrollbar {
      display: none;
    }
    .forecast-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 20px;
      min-width: 80px;
    }
    .time {
      font-weight: bold;
    }
    .temperature {
      font-size: 1.2em;
    }
    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      background-color: rgba(255,255,255,0.7);
    }
    .prev {
      left: 0;
    }
    .next {
      right: 0;
    }
  `]
})
export class HourlyForecastComponent implements AfterViewInit {
  @Input() forecast: any[] = [];
  @ViewChild('forecastContainer') forecastContainer!: ElementRef;
  atStart: boolean = true;
  atEnd: boolean = false;

  ngAfterViewInit() {
    this.checkScrollPosition();
  }

  scroll(direction: number) {
    const container = this.forecastContainer.nativeElement;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollLeft += direction * scrollAmount;
    setTimeout(() => this.checkScrollPosition(), 100);
  }

  checkScrollPosition() {
    const container = this.forecastContainer.nativeElement;
    this.atStart = container.scrollLeft <= 0;
    this.atEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
  }
}