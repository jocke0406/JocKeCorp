import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; // Home reste eager pour l'instant
import {
  authCanMatch,
  authCanActivate,
  guestOnlyCanMatch,
  initiatesOnlyCanMatch,
  initiatesOnlyCanActivate,
} from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Auth
  {
    path: 'login',
    title: 'Connexion — JocKeCorp',
    canMatch: [guestOnlyCanMatch],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Inscriptions fermées — JocKeCorp',
    loadComponent: () =>
      import('./pages/register-closed/register-closed.component').then(
        (m) => m.RegisterClosedComponent
      ),
  },

  // Pages JocKeCorp — désormais publiques
  {
    path: 'certificats',
    loadComponent: () =>
      import('./pages/certificats/certificats.component').then((m) => m.CertificatsComponent),
  },
  {
    path: 'dossier',
    loadComponent: () =>
      import('./pages/dossier-existentiel/dossier-existentiel.component').then(
        (m) => m.DossierExistentielComponent
      ),
  },
  {
    path: 'deculpabilisation',
    loadComponent: () =>
      import('./pages/deculpabilisation/deculpabilisation.component').then(
        (m) => m.DeculpabilisationComponent
      ),
  },
  {
    path: 'deculpabilisation/deculp-ouch-23',
    loadComponent: () =>
      import('./pages/deculpabilisation/deculp-ouch-23/deculp-ouch-23.component').then(
        (m) => m.DeculpOuch23Component
      ),
  },
  {
    path: 'deculpabilisation/deculp-ouch-24',
    loadComponent: () =>
      import('./pages/deculpabilisation/deculp-ouch-24/deculp-ouch-24.component').then(
        (m) => m.DeculpOuch24Component
      ),
  },
  {
    path: 'deculpabilisation/deculp-ouch-25',
    loadComponent: () =>
      import('./pages/deculpabilisation/deculp-ouch-25/deculp-ouch-25.component').then(
        (m) => m.DeculpOuch25Component
      ),
  },
  {
    path: 'deculpabilisation/deculp-ouch-26',
    loadComponent: () =>
      import('./pages/deculpabilisation/deculp-ouch-26/deculp-ouch-26.component').then(
        (m) => m.DeculpOuch26Component
      ),
  },
  {
    path: 'deculpabilisation/deculp-ouch-27',
    loadComponent: () =>
      import('./pages/deculpabilisation/deculp-ouch-27/deculp-ouch-27.component').then(
        (m) => m.DeculpOuch27Component
      ),
  },
  // ⚙️ Nouvelles pages
  {
    path: 'auth/forgot-password',
    title: 'Mot de passe oublié — JocKeCorp',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'auth/reset-password',
    title: 'Réinitialiser le mot de passe — JocKeCorp',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },

  {
    path: 'formations',
    loadComponent: () =>
      import('./pages/formations-inutiles/formations-inutiles.component').then(
        (m) => m.FormationsInutilesComponent
      ),
  },
  {
    path: 'anomalies',
    loadComponent: () =>
      import('./pages/observatoire-anomalies/observatoire-anomalies.component').then(
        (m) => m.ObservatoireAnomaliesComponent
      ),
  },
  {
    path: 'auth/verify-email',
    title: 'Vérification email — JocKeCorp',
    loadComponent: () =>
      import('./pages/verify-email/verify-email.component').then((m) => m.VerifyEmailComponent),
  },

  {
    path: 'welcome',
    title: 'Bienvenue — JocKeCorp',
    canMatch: [authCanMatch],
    canActivate: [authCanActivate],
    loadComponent: () =>
      import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  {
    path: 'certificats/ceic-07-ae',
    title: 'CEIC-07/AE — Certificat d’Effondrement Identitaire Contrôlé',

    loadComponent: () =>
      import('./pages/certificats/ceic-07-ae/ceic-07-ae.component').then(
        (m) => m.Ceic07AeComponent
      ),
  },
  {
    path: 'certificats/ciea-02',
    // guards éventuels ici si tu veux la réserver ensuite
    loadComponent: () =>
      import('./pages/certificats/ciea-02/ciea-02.component').then((m) => m.Ciea02Component),
  },
  {
    path: 'certificats/csio-03',
    // à garder public ou à protéger plus tard comme CEIC-07
    loadComponent: () =>
      import('./pages/certificats/csio-03/csio-03.component').then((m) => m.Csio03Component),
  },
  {
    path: 'certificats/cpo-04',
    // guards éventuels si tu veux le réserver plus tard
    loadComponent: () =>
      import('./pages/certificats/cpo-04/cpo-04.component').then((m) => m.Cpo04Component),
  },
  {
    path: 'certificats/cip-05',
    loadComponent: () =>
      import('./pages/certificats/cip-05/cip-05.component').then((m) => m.Cip05Component),
  },

  // 404
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
