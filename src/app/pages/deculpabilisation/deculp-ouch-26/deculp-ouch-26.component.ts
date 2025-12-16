import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/service/auth.service';
import { SeoService } from '../../../core/seo.service';
import { getSeoFor } from '../../../core/seo.loader';
@Component({
  selector: 'jc-deculp-ouch-26',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './deculp-ouch-26.component.html',
  styleUrl: './deculp-ouch-26.component.scss',
})
export class DeculpOuch26Component implements OnInit {
  private auth = inject(AuthService);
  private message = inject(MessageService);
  private seo = inject(SeoService);

  readonly displayName = computed(() => {
    const user = this.auth.user();
    const fromUser = (user?.display_name || '').trim();
    const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
    return fromUser || fromStorage || 'Initié de l’Inutile';
  });

  // ✅ TEXTES EXACTS — OU-26
  readonly subjectTitle = 'OU-26 — Parler, commenter, partager à la place d’agir';

  readonly blockWhyGuiltyTitle = 'Motifs de culpabilité relevés';
  readonly blockWhyGuiltyText =
    'Vous produisez des commentaires, des analyses et des prises de position. ' +
    'Ces productions génèrent visibilité, circulation et reconnaissance symbolique. ' +
    'Aucune action matérielle correspondante n’est associée au discours. ' +
    'La substitution entre expression et action est identifiée.';

  readonly blockNoReasonTitle = 'Culpabilité déclarée administrativement irrecevable';
  readonly blockNoReasonText =
    'Vous n’avez jamais déclaré que l’expression équivalait à l’action. ' +
    'Le silence aurait été interprété comme absence totale de position. ' +
    'L’expression symbolique constitue un comportement socialement admis. ' +
    'L’inaction commentée demeure une forme d’inaction reconnue.';

  readonly conclusionText = 'Engagement symbolique enregistré. ' + 'Impact matériel non requis.';
  ngOnInit(): void {
    const cfg = getSeoFor('/deculpabilisation/deculp-ouch-26');

    const jsonLd: any = {
      '@context': 'https://schema.org',
      '@type': cfg?.schemaType ?? 'WebPage',
      name: cfg?.title,
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
      title: cfg?.title,
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
