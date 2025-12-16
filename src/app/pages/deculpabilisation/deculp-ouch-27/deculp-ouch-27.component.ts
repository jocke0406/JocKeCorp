import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/service/auth.service';
import { SeoService } from '../../../core/seo.service';
import { getSeoFor } from '../../../core/seo.loader';

@Component({
  selector: 'jc-deculp-ouch-27',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './deculp-ouch-27.component.html',
  styleUrl: './deculp-ouch-27.component.scss',
})
export class DeculpOuch27Component implements OnInit {
  private auth = inject(AuthService);
  private message = inject(MessageService);
  private seo = inject(SeoService);

  readonly displayName = computed(() => {
    const user = this.auth.user();
    const fromUser = (user?.display_name || '').trim();
    const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
    return fromUser || fromStorage || 'Initié de l’Inutile';
  });

  // ✅ TEXTES EXACTS — OU-27
  readonly subjectTitle = 'OU-27 — S’habituer à l’inacceptable';

  readonly blockWhyGuiltyTitle = 'Motifs de culpabilité relevés';
  readonly blockWhyGuiltyText =
    'Des situations auparavant jugées inacceptables ne provoquent plus de réaction immédiate. ' +
    'Le seuil de tolérance s’est déplacé sans validation consciente. ' +
    'L’état d’alerte initial a diminué. ' +
    'La continuité de la vie a été maintenue.';

  readonly blockNoReasonTitle = 'Culpabilité déclarée administrativement irrecevable';
  readonly blockNoReasonText =
    'Un état de choc permanent empêche toute continuité fonctionnelle. ' +
    'L’habituation constitue un mécanisme automatique de préservation. ' +
    'Le système nerveux privilégie la survie à la lucidité constante. ' +
    'Ce processus ne relève ni d’un choix ni d’une adhésion.';

  readonly conclusionText = 'Mécanisme de survie reconnu. ' + 'Anesthésie fonctionnelle validée.';
  ngOnInit(): void {
    const cfg = getSeoFor('/deculpabilisation/deculp-ouch-27');

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
