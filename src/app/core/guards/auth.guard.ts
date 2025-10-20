import { CanActivateFn, CanMatchFn, Route, UrlSegment, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

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
