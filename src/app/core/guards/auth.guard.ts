import { CanActivateFn, CanMatchFn, Route, UrlSegment, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';

export const authCanActivate: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.isAuthenticated() ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const authCanMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAuthenticated()) return true;
    const attemptedUrl = '/' + segments.map(s => s.path).join('/');
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: attemptedUrl } });
};

/** Empêche l'accès à certaines pages si déjà connecté (ex: login/register) */
export const guestOnlyCanMatch: CanMatchFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.isAuthenticated() ? router.createUrlTree(['/']) : true;
};

function checkInitiateAccess(): boolean {
    const auth = inject(AuthService);
    const router = inject(Router);
    const toast = inject(MessageService);

    const loggedIn = auth.isAuthenticated(); // adapte si ta méthode est différente

    if (loggedIn) {
        return true;
    }

    // 🎫 Toast “réservé aux initié·es”
    toast.add({
        severity: 'warn',
        summary: 'Accès réservé',
        detail: 'Ce certificat est réservé aux initié·es. Inscrivez-vous pour continuer.',
        life: 5000,
    });

    router.navigate(['/register']);
    return false;
}

export const initiatesOnlyCanActivate: CanActivateFn = () => {
    return checkInitiateAccess();
};

export const initiatesOnlyCanMatch: CanMatchFn = () => {
    return checkInitiateAccess();
};