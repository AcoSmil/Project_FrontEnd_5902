import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = 'http://localhost:8080';
  readonly apiKey = 'my-secret-key';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-API-Key': this.apiKey });
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.headers() });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.headers() });
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.headers() });
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, { headers: this.headers() });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.headers() });
  }
}
