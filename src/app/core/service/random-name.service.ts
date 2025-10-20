import { Injectable, signal } from '@angular/core';

const DEFAULT_NAMES = [
    'Archiviste', 'Inspecteur', 'Technicien', 'Agent', 'Contrôleur',
    'Coordinateur', 'Superviseur', 'Rédacteur', 'Sous-commissaire',
    'Greffier', 'Préposé', 'Conservateur', 'Intendant', 'Scribe'
];

// Nom « propre » = pas de balises HTML, 2–50 chars, lettres/espaces/’-.
const NAME_OK = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;

@Injectable({ providedIn: 'root' })
export class RandomNameService {
    private loaded = false;
    private names: string[] = [];
    lastAlias = signal<string | null>(null);

    private async loadIfNeeded(): Promise<void> {
        if (this.loaded) return;
        try {
            const res = await fetch('/names.txt', { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();

            // split + nettoyage + filtrage strict (pas de < >, pattern NAME_OK)
            const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const cleaned = lines
                .filter(s => !s.includes('<') && !s.includes('>'))
                .filter(s => NAME_OK.test(s));

            this.names = cleaned.length ? cleaned : DEFAULT_NAMES;
            if (!cleaned.length) console.warn('[RandomNameService] names.txt vide/invalide → fallback DEFAULT_NAMES');
        } catch (e) {
            console.warn('[RandomNameService] fetch names.txt failed → fallback DEFAULT_NAMES', e);
            this.names = DEFAULT_NAMES;
        } finally {
            this.loaded = true;
        }
    }

    private pickName(): string {
        if (!this.names.length) return DEFAULT_NAMES[0];
        const i = Math.floor(Math.random() * this.names.length);
        return this.names[i];
    }

    private sixDigits(): string {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    /** "Bob#_123456" – enregistre aussi dans localStorage */
    async generateAlias(): Promise<string> {
        await this.loadIfNeeded();
        const alias = `${this.pickName()}#_${this.sixDigits()}`;
        this.lastAlias.set(alias);
        try { localStorage.setItem('jocke:alias', alias); } catch { }
        return alias;
    }
}
