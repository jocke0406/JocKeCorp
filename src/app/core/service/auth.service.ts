import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
    _id: string;
    email: string;
    role?: string;
    display_name?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _user = signal<AuthUser | null>(null);
    isAuthenticated = computed(() => this._user() !== null);
    user = computed(() => this._user());

    constructor() {
        // hydratation depuis localStorage au boot
        try {
            const raw = localStorage.getItem('jocke:user');
            if (raw) this._user.set(JSON.parse(raw));
        } catch { }
    }

    setUser(u: AuthUser) {
        this._user.set(u);
        try { localStorage.setItem('jocke:user', JSON.stringify(u)); } catch { }
    }

    clear() {
        this._user.set(null);
        try {
            localStorage.removeItem('jocke:user');
            localStorage.removeItem('jocke:alias');
        } catch { }
    }
}
