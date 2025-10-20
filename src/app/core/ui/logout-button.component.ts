import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
    standalone: true,
    selector: 'app-logout-btn',
    template: `<button (click)="logout()">Se déconnecter</button>`,
})
export class LogoutButtonComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    logout() {
        this.auth.clear();
        this.router.navigateByUrl('/login');
    }
}
