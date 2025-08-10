import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CertificatsComponent } from './pages/certificats/certificats.component';
import { DossierExistentielComponent } from './pages/dossier-existentiel/dossier-existentiel.component';
import { DeculpabilisationComponent } from './pages/deculpabilisation/deculpabilisation.component';
import { FormationsInutilesComponent } from './pages/formations-inutiles/formations-inutiles.component';
import { ObservatoireAnomaliesComponent } from './pages/observatoire-anomalies/observatoire-anomalies.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'certificats', component: CertificatsComponent },
    { path: 'dossier', component: DossierExistentielComponent },
    { path: 'deculpabilisation', component: DeculpabilisationComponent },
    { path: 'formations', component: FormationsInutilesComponent },
    { path: 'anomalies', component: ObservatoireAnomaliesComponent },
    { path: '**', component: NotFoundComponent },
];
