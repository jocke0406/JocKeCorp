// src/app/pages/certificats/ciea-02/ciea-02.component.ts
import {
    Component,
    OnInit,
    computed,
    inject,
    signal,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { SeoService } from '../../../core/seo.service';
import { getSeoFor } from '../../../core/seo.loader';
import { JkcDatePipe } from '../../../core/jkc-date.pipe';
import { JkcDateFormatOptions } from '../../../core/jkc-date.util';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

type CertPanelId = 'certificat' | 'fiche' | 'temoignages';

@Component({
    selector: 'jkc-ciea-02',
    standalone: true,
    imports: [CommonModule, RouterModule, ToastModule, JkcDatePipe],
    providers: [MessageService],
    templateUrl: './ciea-02.component.html',
    styleUrls: ['./ciea-02.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ciea02Component implements OnInit {
    private auth = inject(AuthService);
    private seo = inject(SeoService);
    private message = inject(MessageService);

    /** Date d’émission utilisée comme exemple */
    readonly today = new Date();
    readonly jordanDate = new Date('1993-10-06');
    readonly belgiumDate = new Date('2010-06-13');
    readonly malcolmDate = new Date('1964-04-13');

    readonly jkcLongWithGregorian: JkcDateFormatOptions = {
        format: 'long',
        showGregorianYear: true,
    };

    readonly jkcLong: JkcDateFormatOptions = {
        format: 'long',
    };

    /** Onglet actif : 'certificat' | 'fiche' | 'temoignages' */
    readonly activePanel = signal<CertPanelId>('certificat');

    /** Nom affiché : user.display_name -> localStorage -> fallback */
    readonly displayName = computed(() => {
        const user = this.auth.user();
        const fromUser = (user?.display_name || '').trim();
        const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
        return fromUser || fromStorage || 'Initié de l’Inutile';
    });

    /** Actions qui nécessitent l’authentification */
    requireAuth(action: string): void {
        const user = this.auth.user();
        if (user) {
            // TODO: plug API/backend quand prêt
            console.log(`Action authentifiée (CIEA-02) : ${action}`);
            return;
        }

        this.message.add({
            severity: 'warn',
            summary: 'Action réservée',
            detail: 'Veuillez vous connecter pour accéder à cette fonction.',
            life: 3000,
        });
    }

    ngOnInit(): void {
        const cfg = getSeoFor('/certificats/ciea-02');

        const jsonLd: any = {
            '@context': 'https://schema.org',
            '@type': cfg?.schemaType ?? 'WebPage',
            name:
                cfg?.title ??
                'CIEA-02 — Certificat d’Incertitude Existentielle Active',
            url: cfg?.canonical,
        };

        if (cfg?.breadcrumbs?.length) {
            jsonLd.breadcrumb = {
                '@type': 'BreadcrumbList',
                itemListElement: cfg.breadcrumbs.map(
                    (crumb: { name: string; url: string }, index: number) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: crumb.name,
                        item: crumb.url,
                    }),
                ),
            };
        }

        this.seo.setMeta({
            title:
                cfg?.title ??
                'CIEA-02 — Certificat d’Incertitude Existentielle Active',
            description:
                cfg?.description ??
                "Certificat d’Incertitude Existentielle Active — JocKeCorp™. Documentant la coexistence entre identité présente et absence de direction claire.",
            canonical: cfg?.canonical,
            robots: cfg?.robots,
            image: cfg?.ogImage,
            jsonLd,
        });
    }

    selectPanel(panelId: CertPanelId): void {
        this.activePanel.set(panelId);
    }

    isActivePanel(panelId: CertPanelId): boolean {
        return this.activePanel() === panelId;
    }
}
