import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/service/auth.service'; // ✅ comme CEIC
import { SeoService } from '../../../core/seo.service';
import { getSeoFor } from '../../../core/seo.loader';
@Component({
  selector: 'jc-deculp-ouch-24',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './deculp-ouch-24.component.html',
  styleUrl: './deculp-ouch-24.component.scss',
})
export class DeculpOuch24Component implements OnInit {
  private auth = inject(AuthService);
  private message = inject(MessageService);
  private seo = inject(SeoService);

  readonly displayName = computed(() => {
    const user = this.auth.user();
    const fromUser = (user?.display_name || '').trim();
    const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
    return fromUser || fromStorage || 'Initié de l’Inutile';
  });

  // ✅ TEXTES EXACTS OU-24
  readonly subjectTitle = 'OU-24 — Profiter de ce que l’on condamne';

  readonly blockWhyGuiltyTitle = 'Motifs de culpabilité relevés';
  readonly blockWhyGuiltyText =
    'Vous critiquez un système dont vous utilisez les infrastructures. ' +
    'Votre confort dépend de mécanismes que vous désapprouvez publiquement. ' +
    'Les bénéfices sont consommés pendant que la condamnation est verbale. ' +
    'L’écart entre discours et usage est identifié.';

  readonly blockNoReasonTitle = 'Culpabilité déclarée administrativement irrecevable';
  readonly blockNoReasonText =
    'Aucune alternative opérationnelle globale n’est disponible. ' +
    'La pureté idéologique n’est pas compatible avec la continuité sociale. ' +
    'Bénéficier d’un système n’implique pas adhésion morale explicite. ' +
    'L’intégration initiale au dispositif n’a fait l’objet d’aucun consentement.';

  readonly conclusionText =
    'Participation contrainte validée. ' + 'Non-adhésion morale présumée suffisante.';
  ngOnInit(): void {
    const cfg = getSeoFor('/deculpabilisation/deculp-ouch-24');

    const pageJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': cfg?.schemaType ?? 'WebPage',
      name: cfg?.title ?? this.subjectTitle,
      url: cfg?.canonical ?? 'https://jocke.be/deculpabilisation/deculp-ouch-24',
    };

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

    const articleJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: this.subjectTitle,
      description:
        cfg?.description ??
        'Dossier OU-24 : usage confirmé d’un système contesté. Écart entre discours et infrastructures relevé. Culpabilité non recevable administrativement.',
      isPartOf: {
        '@type': 'WebPage',
        url: 'https://jocke.be/deculpabilisation',
        name: 'Service Central de Déculpabilisation',
      },
      mainEntityOfPage: cfg?.canonical ?? 'https://jocke.be/deculpabilisation/deculp-ouch-24',
      articleSection: 'Déculpabilisation',
      keywords: ['OU-24', 'déculpabilisation', 'contradiction', 'discours', 'usage', 'système'],
      author: { '@type': 'Organization', name: 'JocKeCorp™' },
      publisher: { '@type': 'Organization', name: 'JocKeCorp™' },
    };

    this.seo.setMeta({
      title: cfg?.title ?? `${this.subjectTitle} | JocKeCorp™`,
      description: cfg?.description,
      canonical: cfg?.canonical,
      robots: cfg?.robots,
      image: cfg?.ogImage,
      jsonLd: [pageJsonLd, articleJsonLd],
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
