import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherForecast } from '../weather.service';

@Component({
  selector: 'app-weather',
  imports: [CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather implements OnInit {
  forecasts: WeatherForecast[] = [];
  isLoading = false;
  errorMessage = '';
  isRefreshing = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.isRefreshing = true;

    this.weatherService.getForecasts().subscribe({
      next: (data) => {
        this.forecasts = data;
        this.isLoading = false;
        this.isRefreshing = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'An error occurred while fetching weather data. Please try again.';
        this.isLoading = false;
        this.isRefreshing = false;
        this.forecasts = [];
      }
    });
  }
}
