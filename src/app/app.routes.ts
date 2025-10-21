import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; // Home reste eager pour l'instant
import { authCanMatch, authCanActivate, guestOnlyCanMatch } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },

    // Auth
    {
        path: 'login',
        title: 'Connexion — JocKeCorp',
        canMatch: [guestOnlyCanMatch],
        loadComponent: () =>
            import('./pages/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        title: 'Inscriptions fermées — JocKeCorp',
        loadComponent: () =>
            import('./pages/register-closed/register-closed.component')
                .then(m => m.RegisterClosedComponent),
    },


    // Pages JockeCorp
    {
        path: 'certificats',
        canMatch: [authCanMatch],
        canActivate: [authCanActivate],
        loadComponent: () =>
            import('./pages/certificats/certificats.component').then(
                m => m.CertificatsComponent
            ),
    },
    {
        path: 'dossier',
        canMatch: [authCanMatch],
        canActivate: [authCanActivate],
        loadComponent: () =>
            import('./pages/dossier-existentiel/dossier-existentiel.component').then(
                m => m.DossierExistentielComponent
            ),
    },
    {
        path: 'deculpabilisation',
        canMatch: [authCanMatch],
        canActivate: [authCanActivate],
        loadComponent: () =>
            import('./pages/deculpabilisation/deculpabilisation.component').then(
                m => m.DeculpabilisationComponent
            ),
    },

    // ⚙️ Nouvelles pages
    {
        path: 'auth/forgot-password',
        title: 'Mot de passe oublié — JocKeCorp',
        loadComponent: () =>
            import('./pages/forgot-password/forgot-password.component').then(
                m => m.ForgotPasswordComponent
            ),
    },
    {
        path: 'auth/reset-password',
        title: 'Réinitialiser le mot de passe — JocKeCorp',
        loadComponent: () =>
            import('./pages/reset-password/reset-password.component').then(
                m => m.ResetPasswordComponent
            ),
    },

    {
        path: 'formations',
        canMatch: [authCanMatch],
        canActivate: [authCanActivate],
        loadComponent: () =>
            import('./pages/formations-inutiles/formations-inutiles.component').then(
                m => m.FormationsInutilesComponent
            ),
    },
    {
        path: 'anomalies',
        canMatch: [authCanMatch],
        canActivate: [authCanActivate],
        loadComponent: () =>
            import('./pages/observatoire-anomalies/observatoire-anomalies.component').then(
                m => m.ObservatoireAnomaliesComponent
            ),
    },
    {
        path: 'auth/verify-email',
        title: 'Vérification email — JocKeCorp',
        loadComponent: () =>
            import('./pages/verify-email/verify-email.component').then(
                m => m.VerifyEmailComponent
            ),
    },

    {
        path: 'welcome',
        title: 'Bienvenue — JocKeCorp',
        canMatch: [authCanMatch],
        canActivate: [authCanActivate],
        loadComponent: () =>
            import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
    },

    // 404
    {
        path: '**',
        loadComponent: () =>
            import('./pages/not-found/not-found.component').then(
                m => m.NotFoundComponent
            ),
    },
];
