import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/service/auth.service'; // ✅ comme CEIC
import { SeoService } from '../../../core/seo.service';
import { getSeoFor } from '../../../core/seo.loader';

@Component({
  selector: 'jc-deculp-ouch-23',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './deculp-ouch-23.component.html',
  styleUrl: './deculp-ouch-23.component.scss',
})
export class DeculpOuch23Component implements OnInit {
  private auth = inject(AuthService);
  private message = inject(MessageService);
  private seo = inject(SeoService);

  // (optionnel) utile si tu veux afficher "Sujet observé : ..."
  readonly displayName = computed(() => {
    const user = this.auth.user();
    const fromUser = (user?.display_name || '').trim();
    const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
    return fromUser || fromStorage || 'Initié de l’Inutile';
  });

  readonly subjectTitle = 'OU-23 — Continuer pendant que le monde s’effondre';

  readonly blockWhyGuiltyTitle = 'Motifs de culpabilité relevés';
  readonly blockWhyGuiltyText =
    'L’information est omniprésente, insistante, documentée. ' +
    'Vous en avez connaissance. ' +
    'Malgré cela, vous continuez à manger chaud, dormir au calme et prévoir la suite. ' +
    'Votre normalité se maintient tandis que celle des autres se désagrège.';

  readonly blockNoReasonTitle = 'Culpabilité jugée officiellement non recevable';
  readonly blockNoReasonText =
    'L’interruption volontaire de votre confort ne produirait aucun effet mesurable. ' +
    'L’inconfort individuel ne constitue pas une politique collective. ' +
    'La vie ordinaire n’a jamais été soumise à une condition morale préalable. ' +
    'L’état général du monde ne dépend pas de votre situation personnelle.';

  readonly conclusionText =
    'Maintien du confort autorisé. Votre vie peut continuer sans incidence significative sur l’état général du monde.';
  ngOnInit(): void {
    const cfg = getSeoFor('/deculpabilisation/deculp-ouch-23');

    const pageJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': cfg?.schemaType ?? 'WebPage',
      name: cfg?.title ?? this.subjectTitle,
      url: cfg?.canonical ?? 'https://jocke.be/deculpabilisation/deculp-ouch-23',
    };

    // ✅ BreadcrumbList (Google)
    if (cfg?.breadcrumbs?.length) {
      pageJsonLd.breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: cfg.breadcrumbs.map(
          (crumb: { name: string; url: string }, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
          })
        ),
      };
    }

    // ✅ Article (le “dossier”)
    const articleJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: this.subjectTitle,
      description:
        cfg?.description ??
        'Dossier OU-23 : constat d’un confort maintenu en contexte global dégradé. Deux constats administratifs, une conclusion brève.',
      isPartOf: {
        '@type': 'WebPage',
        url: 'https://jocke.be/deculpabilisation',
        name: 'Service Central de Déculpabilisation',
      },
      mainEntityOfPage: cfg?.canonical ?? 'https://jocke.be/deculpabilisation/deculp-ouch-23',
      articleSection: 'Déculpabilisation',
      keywords: ['OU-23', 'déculpabilisation', 'charge morale', 'culpabilité', 'confort'],
      author: {
        '@type': 'Organization',
        name: 'JocKeCorp™',
      },
      publisher: {
        '@type': 'Organization',
        name: 'JocKeCorp™',
      },
    };

    // tableau JSON-LD (nickel)
    const jsonLd = [pageJsonLd, articleJsonLd];

    this.seo.setMeta({
      title: cfg?.title ?? `${this.subjectTitle} | JocKeCorp™`,
      description: cfg?.description,
      canonical: cfg?.canonical,
      robots: cfg?.robots,
      image: cfg?.ogImage,
      jsonLd,
    });
  }

  /** ✅ clone CEIC : on vérifie auth.user() */
  requestAbsolution(): void {
    const user = this.auth.user();

    if (!user) {
      this.message.add({
        severity: 'warn',
        summary: 'Accès restreint',
        detail: 'Veuillez vous connecter pour accéder à l’absolution.',
        life: 3500,
      });
      return;
    }

    this.message.add({
      severity: 'success',
      summary: 'Dossier clos',
      detail: 'Marche en paix.',
      life: 3000,
    });
  }
}
