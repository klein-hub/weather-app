import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '6e14630276ce44f6988120135241810';
  private apiUrl = 'https://api.weatherapi.com/v1';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/forecast.json?key=${this.apiKey}&q=${city}`)
      .pipe(
        map((response: any) => ({
          current: this.processCurrentWeather(response),
          forecast: this.processHourlyForecast(response)
        })),
        catchError(this.handleError)
      );
  }

  private processCurrentWeather(data: any): any {
    return {
      name: data.location.name,
      main: {
        temp: data.current.temp_c,
        humidity: data.current.humidity
      },
      weather: [{
        description: data.current.condition.text,
        icon: data.current.condition.icon
      }],
      wind: {
        speed: data.current.wind_kph / 3.6 // Convert km/h to m/s
      }
    };
  }

  private processHourlyForecast(data: any): any[] {
    const currentHour = new Date().getHours();
    return data.forecast.forecastday[0].hour
      .slice(currentHour)
      .concat(data.forecast.forecastday[0].hour.slice(0, currentHour))
      .map((hour: any) => ({
        dt_txt: hour.time,
        main: {
          temp: hour.temp_c
        },
        weather: [{
          icon: hour.condition.icon
        }]
      }));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}