import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; // Home reste eager pour l'instant

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Page d’accueil, chargée directement

    // Auth
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./pages/register/register.component').then(m => m.RegisterComponent),
    },

    // Pages JockeCorp
    {
        path: 'certificats',
        loadComponent: () =>
            import('./pages/certificats/certificats.component').then(
                m => m.CertificatsComponent
            ),
    },
    {
        path: 'dossier',
        loadComponent: () =>
            import('./pages/dossier-existentiel/dossier-existentiel.component').then(
                m => m.DossierExistentielComponent
            ),
    },
    {
        path: 'deculpabilisation',
        loadComponent: () =>
            import('./pages/deculpabilisation/deculpabilisation.component').then(
                m => m.DeculpabilisationComponent
            ),
    },
    {
        path: 'formations',
        loadComponent: () =>
            import('./pages/formations-inutiles/formations-inutiles.component').then(
                m => m.FormationsInutilesComponent
            ),
    },
    {
        path: 'anomalies',
        loadComponent: () =>
            import('./pages/observatoire-anomalies/observatoire-anomalies.component').then(
                m => m.ObservatoireAnomaliesComponent
            ),
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

