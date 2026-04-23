import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Trip, SeatStatus } from '../models/trip.model';

export interface Route {
  id: number;
  source: string;
  destination: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/trips`;
  private routesUrl = `${environment.apiUrl}/routes`;

  searchTrips(source: string, destination: string, date: string) {
    const params = new HttpParams()
      .set('source', source)
      .set('destination', destination)
      .set('date', date);

    return this.http.get<Trip[]>(`${this.apiUrl}/search`, { params });
  }

  getTripById(tripId: number) {
    return this.http.get<Trip>(`${this.apiUrl}/${tripId}`);
  }


  getTripSeats(tripId: number) {
    return this.http.get<SeatStatus[]>(`${this.apiUrl}/${tripId}/seats`);
  }

  getSourceSuggestions(query = '') {
    let params = new HttpParams();
    if (query.trim()) {
      params = params.set('query', query.trim());
    }

    return this.http.get<string[]>(`${this.routesUrl}/sources`, { params });
  }

  getDestinationSuggestions(source = '', query = '') {
    let params = new HttpParams();
    if (source.trim()) {
      params = params.set('source', source.trim());
    }
    if (query.trim()) {
      params = params.set('query', query.trim());
    }

    return this.http.get<string[]>(`${this.routesUrl}/destinations`, { params });
  }

  getRoutes() {
    return this.http.get<Route[]>(this.routesUrl);
  }
}
