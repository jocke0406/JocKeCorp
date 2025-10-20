import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../env'; // adapte le chemin selon où est ton env.ts

type Primitive = string | number | boolean | null | undefined;

function ensureApiBaseUrl(): string {
    const url = ENV?.apiBase as string | undefined;
    if (!url) {
        throw new Error('ENV.apiBase manquant. Défini-le dans env.ts (ex: apiBase: "https://api.jocke.be").');
    }
    return url.replace(/\/+$/, '');
}

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly base = ensureApiBaseUrl();

    private paramsFrom(obj?: Record<string, Primitive>): HttpParams | undefined {
        if (!obj) return undefined;
        let p = new HttpParams();
        for (const [k, v] of Object.entries(obj)) {
            if (v === undefined || v === null) continue;
            p = p.set(k, String(v));
        }
        return p;
    }

    private url(path: string): string {
        return `${this.base}${path.startsWith('/') ? path : '/' + path}`;
    }

    get<TResponse>(path: string, opts?: { params?: Record<string, Primitive>; headers?: Record<string, string> }): Observable<TResponse> {
        return this.http.get<TResponse>(this.url(path), { params: this.paramsFrom(opts?.params), headers: opts?.headers });
    }

    post<TResponse, TBody = unknown>(path: string, body: TBody, opts?: { params?: Record<string, Primitive>; headers?: Record<string, string> }): Observable<TResponse> {
        return this.http.post<TResponse>(this.url(path), body, { params: this.paramsFrom(opts?.params), headers: opts?.headers });
    }

    put<TResponse, TBody = unknown>(path: string, body: TBody, opts?: { params?: Record<string, Primitive>; headers?: Record<string, string> }): Observable<TResponse> {
        return this.http.put<TResponse>(this.url(path), body, { params: this.paramsFrom(opts?.params), headers: opts?.headers });
    }

    patch<TResponse, TBody = unknown>(path: string, body: TBody, opts?: { params?: Record<string, Primitive>; headers?: Record<string, string> }): Observable<TResponse> {
        return this.http.patch<TResponse>(this.url(path), body, { params: this.paramsFrom(opts?.params), headers: opts?.headers });
    }

    delete<TResponse>(path: string, opts?: { params?: Record<string, Primitive>; headers?: Record<string, string> }): Observable<TResponse> {
        return this.http.delete<TResponse>(this.url(path), { params: this.paramsFrom(opts?.params), headers: opts?.headers });
    }
}
