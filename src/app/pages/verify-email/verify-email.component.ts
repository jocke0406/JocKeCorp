import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ApiService } from '../../core/service/api.service';

@Component({
    standalone: true,
    selector: 'app-verify-email',
    imports: [CommonModule, RouterLink],
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly api = inject(ApiService);
    private readonly router = inject(Router);

    state = signal<'pending' | 'ok' | 'err'>('pending');
    errorMsg = signal<string | null>(null);
    resendMsg = signal<string | null>(null);
    resending = signal(false);

    constructor() {
        const token = this.route.snapshot.queryParamMap.get('token');
        if (!token) {
            this.state.set('err');
            this.errorMsg.set('Token manquant.');
            return;
        }
        this.api.get<{ message: string }>('/auth/verify-email', { params: { token } }).subscribe({
            next: () => {
                this.state.set('ok');
                // Redirection douce vers /login avec un message
                setTimeout(() => this.router.navigate(['/login'], { queryParams: { verify: 'ok' } }), 900);
            },
            error: (err) => {
                this.state.set('err');
                this.errorMsg.set(err?.error?.error ?? 'Token invalide ou expiré.');
            },
        });
    }

    resend() {
        this.resending.set(true);
        this.resendMsg.set(null);
        const email = localStorage.getItem('jocke:last-email') ?? '';
        const body = email ? { email } : {};
        this.api.post<{ message: string }, any>('/auth/resend-verify', body).subscribe({
            next: (r) => this.resendMsg.set(r?.message ?? 'Si le compte existe, un email a été envoyé.'),
            error: () => this.resendMsg.set('Impossible d’envoyer l’email maintenant.'),
            complete: () => this.resending.set(false),
        });
    }
}
