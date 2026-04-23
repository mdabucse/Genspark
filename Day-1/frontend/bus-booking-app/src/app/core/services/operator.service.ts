import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OperatorDashboardStats {
  totalBuses: number;
  activeTrips: number;
  todayBookings: number;
  totalRevenue: number;
}

export interface BusData {
  id?: number;
  busNumber: string;
  busName: string;
  capacity: number;
  busType: string;
  seatLayout: string;
  isActive?: boolean;
  operatorId?: number;
  createdAt?: string;
}

export interface OperatorTrip {
  id: number;
  busName: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  baseFare: number;
  taxPercent: number;
  status: string;
  bookedSeats: number;
  totalSeats: number;
}

export interface OperatorBooking {
  id: number;
  bookingRef: string;
  status: string;
  totalAmount: number;
  bookedAt: string;
  userName: string;
  busName: string;
  route: string;
  departureTime: string;
  passengers: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/operator`;

  getDashboard(): Observable<OperatorDashboardStats> {
    return this.http.get<OperatorDashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getMyBuses(): Observable<BusData[]> {
    return this.http.get<BusData[]>(`${this.apiUrl}/buses`);
  }

  addBus(bus: BusData): Observable<BusData> {
    return this.http.post<BusData>(`${this.apiUrl}/buses`, bus);
  }

  editBus(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/buses/${id}`, data);
  }

  blockBus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/buses/${id}/block`, {});
  }

  getMyTrips(): Observable<OperatorTrip[]> {
    return this.http.get<OperatorTrip[]>(`${this.apiUrl}/trips`);
  }

  scheduleTrip(trip: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/trips`, trip);
  }

  updatePricing(tripId: number, baseFare: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/trips/${tripId}/pricing`, baseFare);
  }

  getMyBookings(params?: any): Observable<OperatorBooking[]> {
    return this.http.get<OperatorBooking[]>(`${this.apiUrl}/bookings`, { params });
  }

  getRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/routes`);
  }
}
