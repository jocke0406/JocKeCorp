// src/app/pages/certificats/ceic-07-ae/ceic-07-ae.component.ts
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
import { JkcDatePipe } from '../../../core/jkc-date.pipe'; // ✅ le pipe
import { JkcDateFormatOptions } from '../../../core/jkc-date.util';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


type CertPanelId = 'certificat' | 'fiche' | 'temoignages';

@Component({
    selector: 'jkc-ceic-07-ae',
    standalone: true,
    imports: [CommonModule, RouterModule, ToastModule, JkcDatePipe], // ✅ on l’importe ici
    providers: [MessageService],
    templateUrl: './ceic-07-ae.component.html',
    styleUrls: ['./ceic-07-ae.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ceic07AeComponent implements OnInit {
    private auth = inject(AuthService);
    private seo = inject(SeoService);
    private message = inject(MessageService);
    /** Date d’émission utilisée comme exemple */
    readonly today = new Date(); // tu peux forcer une autre date si tu veux
    readonly banksyDate = new Date('2018-10-05');
    readonly satoshiDate = new Date('2009-01-03');
    readonly eminemDate = new Date('1999-02-23');

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

    requireAuth(action: string): void {
        const user = this.auth.user();
        if (user) {
            console.log(`Action authentifiée : ${action}`);
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
        const cfg = getSeoFor('/certificats/ceic-07-ae');

        const jsonLd: any = {
            '@context': 'https://schema.org',
            '@type': cfg?.schemaType ?? 'WebPage',
            name: cfg?.title ?? 'CEIC-07/AE — Certificat d’Effondrement Identitaire Contrôlé',
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
            title: cfg?.title ?? 'CEIC-07/AE — Certificat d’Effondrement Identitaire Contrôlé',
            description:
                cfg?.description ??
                "Certificat d’Effondrement Identitaire Contrôlé — JocKeCorp™. Document constatant la stabilité apparente d’un être pluriel.",
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
