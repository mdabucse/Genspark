import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherForecast } from '../weather.service';

@Component({
  selector: 'app-weather',
  imports: [CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather implements OnInit {
  forecasts = signal<WeatherForecast[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  isRefreshing = signal(false);

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.isRefreshing.set(true);

    this.weatherService.getForecasts().subscribe({
      next: (data) => {
        this.forecasts.set(data);
        this.isLoading.set(false);
        this.isRefreshing.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'An error occurred while fetching weather data. Please try again.');
        this.isLoading.set(false);
        this.isRefreshing.set(false);
        this.forecasts.set([]);
      }
    });
  }
}
