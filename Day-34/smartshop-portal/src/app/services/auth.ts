import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject =
    new BehaviorSubject<any>(null);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userSubject.next(user);
        const token = user?.accessToken ?? user?.token;
        if (token) {
          localStorage.setItem('sessionId', token);
        }
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('sessionId');
      }
    }
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  getSessionId() {
    return localStorage.getItem('sessionId');
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
  }

  isLoggedIn() {
    return !!this.getSessionId();
  }

  login(credentials: any) {
    return this.http.post(
      'https://dummyjson.com/auth/login',
      credentials
    ).pipe(
      tap((user: any) => {
        this.setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        const token = user.accessToken ?? user.token;
        if (token) {
          localStorage.setItem('sessionId', token);
        }
      })
    );
  }
}