import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { WeatherComponent } from './weather.component';
import { SearchBarComponent } from './search-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { provideHttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherComponent, SearchBarComponent, MatToolbarModule, MatCardModule, MatSnackBarModule],
  template: `
    <mat-toolbar color="primary">
      <span>Weather App</span>
    </mat-toolbar>
    <div class="content">
      <app-search-bar (search)="onSearch($event)"></app-search-bar>
      <app-weather [city]="currentCity"></app-weather>
    </div>
  `,
  styles: [`
    .content {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class App {
  currentCity: string = 'New York';

  onSearch(city: string) {
    this.currentCity = city;
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));