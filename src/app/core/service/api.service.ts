import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../../env';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private base = ENV.apiBase;
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    get<T>(path: string, params?: Record<string, any>): Observable<T> {
        return this.http.get<T>(`${this.base}${path}`, { params, headers: this.headers })
            .pipe(catchError(this.handle));
    }
    post<T>(path: string, body: unknown): Observable<T> {
        return this.http.post<T>(`${this.base}${path}`, body, { headers: this.headers })
            .pipe(catchError(this.handle));
    }
    patch<T>(path: string, body: unknown): Observable<T> {
        return this.http.patch<T>(`${this.base}${path}`, body, { headers: this.headers })
            .pipe(catchError(this.handle));
    }
    delete<T>(path: string): Observable<T> {
        return this.http.delete<T>(`${this.base}${path}`, { headers: this.headers })
            .pipe(catchError(this.handle));
    }

    private handle(err: HttpErrorResponse) {
        console.error('❌ API error:', err);
        return throwError(() => err);
    }
}
