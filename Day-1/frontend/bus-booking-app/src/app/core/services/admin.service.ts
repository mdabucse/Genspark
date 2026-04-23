import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminDashboardStats {
  totalUsers: number;
  totalOperators: number;
  pendingOperators: number;
  tripsToday: number;
  totalRevenue: number;
  todayRevenue: number;
}

export interface RouteData {
  id?: number;
  source: string;
  destination: string;
  distanceKm: number;
  tripCount?: number;
  createdAt?: string;
}

export interface OperatorData {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  busCount: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  // Dashboard
  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/dashboard`);
  }

  // Routes
  getRoutes(): Observable<RouteData[]> {
    return this.http.get<RouteData[]>(`${this.apiUrl}/routes`);
  }

  createRoute(route: RouteData): Observable<RouteData> {
    return this.http.post<RouteData>(`${this.apiUrl}/routes`, route);
  }

  // Operators
  getOperators(): Observable<OperatorData[]> {
    return this.http.get<OperatorData[]>(`${this.apiUrl}/operators`);
  }

  approveOperator(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/operators/${id}/approve`, {});
  }

  rejectOperator(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/operators/${id}/reject`, {});
  }

  blockOperator(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/operators/${id}/block`, {});
  }

  unblockOperator(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/operators/${id}/unblock`, {});
  }
}
