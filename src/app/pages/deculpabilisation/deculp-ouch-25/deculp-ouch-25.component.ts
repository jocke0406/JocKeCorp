import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/service/auth.service';
import { SeoService } from '../../../core/seo.service';
import { getSeoFor } from '../../../core/seo.loader';

@Component({
  selector: 'jc-deculp-ouch-25',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './deculp-ouch-25.component.html',
  styleUrl: './deculp-ouch-25.component.scss',
})
export class DeculpOuch25Component implements OnInit {
  private auth = inject(AuthService);
  private message = inject(MessageService);
  private seo = inject(SeoService);

  readonly displayName = computed(() => {
    const user = this.auth.user();
    const fromUser = (user?.display_name || '').trim();
    const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
    return fromUser || fromStorage || 'Initié de l’Inutile';
  });

  readonly subjectTitle = 'OU-25 — S’indigner de manière sélective';

  readonly blockWhyGuiltyTitle = 'Motifs de culpabilité relevés';
  readonly blockWhyGuiltyText =
    'Certaines injustices déclenchent votre réaction, d’autres non. ' +
    'Le tri opéré ne repose pas sur une hiérarchie explicite. ' +
    'La proximité, la visibilité et la répétition médiatique influencent la réponse. ' +
    'L’indignation produite est partielle et non exhaustive.';

  readonly blockNoReasonTitle = 'Culpabilité déclarée administrativement irrecevable';
  readonly blockNoReasonText =
    'Une indignation universelle excéderait les capacités humaines standard. ' +
    'Les ressources émotionnelles sont limitées par conception. ' +
    'L’empathie totale mènerait à une défaillance fonctionnelle. ' +
    'Aucune obligation de cohérence morale globale n’est en vigueur.';

  readonly conclusionText = 'Empathie partielle reconnue conforme. Cohérence morale non exigée.';

  ngOnInit(): void {
    const cfg = getSeoFor('/deculpabilisation/deculp-ouch-25');

    const jsonLd: any = {
      '@context': 'https://schema.org',
      '@type': cfg?.schemaType ?? 'WebPage',
      name: cfg?.title ?? this.subjectTitle,
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
          })
        ),
      };
    }

    this.seo.setMeta({
      title: cfg?.title ?? this.subjectTitle,
      description: cfg?.description,
      canonical: cfg?.canonical,
      robots: cfg?.robots,
      image: cfg?.ogImage,
      jsonLd,
    });
  }

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
