import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5192/api';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(map(response => {
        this.setToken(response.token);
        this.loggedInSubject.next(true); // Zaktualizuj stan logowania
        return response.token;
      }));
  }

  // Możesz także dodać metodę do zapisywania tokenu
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false); // Zaktualizuj stan logowania
  }

  isAuthenticated(): Observable<boolean> {
    console.log('hehe');
    return this.loggedInSubject.asObservable(); // Zwróć stan jako Observable
  }
}
