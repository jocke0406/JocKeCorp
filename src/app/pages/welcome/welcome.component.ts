import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { RandomNameService } from '../../core/service/random-name.service';

@Component({
    standalone: true,
    selector: 'app-welcome',
    imports: [CommonModule, RouterLink],
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
    private readonly auth = inject(AuthService);
    private readonly aliasSvc = inject(RandomNameService);

    // Nom d’affichage (jamais l’email)
    displayName = computed(() => {
        const user = this.auth.user();
        const fromUser = (user?.display_name || '').trim();
        const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
        return fromUser || fromStorage || 'Initié de l’Inutile';
    });

    // Alias courant (alias du login si dispo, sinon fallback localStorage, sinon on le génère à la volée)
    alias = signal<string | null>(null);

    constructor() {
        const existing = this.aliasSvc.lastAlias() ?? localStorage.getItem('jocke:alias');
        if (existing) {
            this.alias.set(existing);
        } else {
            // Génère un alias si on arrive ici sans passer par le login (cas rare)
            this.aliasSvc.generateAlias().then(a => this.alias.set(a));
        }
    }
}
