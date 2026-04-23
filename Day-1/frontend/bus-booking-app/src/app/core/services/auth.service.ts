import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  currentUserRole$ = this.currentUserRoleSubject.asObservable();

  register(data: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(data: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  getProfile() {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put<any>(`${this.apiUrl}/profile`, data).pipe(
      tap(res => {
        localStorage.setItem('name', res.name);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    this.currentUserRoleSubject.next(null);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get currentRole(): string | null {
    return localStorage.getItem('role');
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('name', res.name);
    localStorage.setItem('email', res.email);
    this.currentUserRoleSubject.next(res.role);
  }
}
