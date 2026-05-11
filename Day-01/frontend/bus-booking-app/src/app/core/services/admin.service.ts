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

export interface OperatorPerformance {
  id: number;
  name: string;
  email: string;
  phone: string;
  busCount: number;
  totalBookings: number;
  totalRevenue: number;
  activeTrips: number;
  completedTrips: number;
  cancelledTrips: number;
}

export interface AuditLog {
  id: number;
  action: string;
  description: string;
  targetType: string;
  targetId: string;
  adminEmail: string;
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

  // Reports
  getOperatorPerformance(): Observable<OperatorPerformance[]> {
    return this.http.get<OperatorPerformance[]>(`${this.apiUrl}/reports/operator-performance`);
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

  blockOperator(id: number, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/operators/${id}/block`, { password });
  }

  unblockOperator(id: number, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/operators/${id}/unblock`, { password });
  }

  // Bookings
  getBookings(operatorId?: number, page: number = 1, pageSize: number = 20): Observable<any> {
    let url = `${this.apiUrl}/bookings?page=${page}&pageSize=${pageSize}`;
    if (operatorId) url += `&operatorId=${operatorId}`;
    return this.http.get<any>(url);
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/audit-logs`);
  }
}
