import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  // App States
  public cityQuery: string = '';
  public weatherData: any = null;
  public loading: boolean = false;
  public errorMessage: string = '';
  public tempUnit: 'C' | 'F' = 'C';
  public apiHealth: 'unknown' | 'healthy' | 'unhealthy' = 'unknown';

  // Popular cities for quick selection
  public popularCities: string[] = ['New York', 'London', 'Tokyo', 'Sydney', 'Paris', 'Cairo'];

  ngOnInit(): void {
    this.checkApiHealth();
    this.fetchWeather('New York');
  }

  // URL Helper - always use relative /api path.
  // Angular dev server proxies /api -> localhost:5000 via proxy.conf.json
  // Nginx proxies /api -> localhost:5000 in production
  private getApiUrl(endpoint: string): string {
    return `/api/${endpoint}`;
  }

  public checkApiHealth(): void {
    const url = this.getApiUrl('health');
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.apiHealth = res.status === 'Healthy' ? 'healthy' : 'unhealthy';
        this.cdr.detectChanges();
      },
      error: () => {
        this.apiHealth = 'unhealthy';
        this.cdr.detectChanges();
      }
    });
  }

  public fetchWeather(city: string): void {
    if (!city || city.trim() === '') return;

    this.loading = true;
    this.errorMessage = '';
    const url = this.getApiUrl('weather') + '?city=' + encodeURIComponent(city.trim());

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
        this.apiHealth = 'healthy';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = `Could not fetch weather data for "${city}". Please verify the backend API is running.`;
        this.loading = false;
        this.apiHealth = 'unhealthy';
        this.cdr.detectChanges();
      }
    });
  }

  public onSearchSubmit(): void {
    if (this.cityQuery) {
      this.fetchWeather(this.cityQuery);
    }
  }

  public selectCity(city: string): void {
    this.cityQuery = city;
    this.fetchWeather(city);
  }

  public toggleTempUnit(): void {
    this.tempUnit = this.tempUnit === 'C' ? 'F' : 'C';
  }

  // Helper to determine background CSS class based on current condition
  public getWeatherClass(): string {
    if (!this.weatherData || !this.weatherData.current) return 'theme-default';
    const condition = this.weatherData.current.condition.toLowerCase();

    if (condition.includes('sunny') || condition.includes('clear')) return 'theme-sunny';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'theme-rainy';
    if (condition.includes('cloud') || condition.includes('overcast')) return 'theme-cloudy';
    if (condition.includes('snow') || condition.includes('freeze')) return 'theme-snowy';
    if (condition.includes('storm') || condition.includes('thunder')) return 'theme-stormy';
    if (condition.includes('wind') || condition.includes('breeze')) return 'theme-windy';

    return 'theme-default';
  }
}
