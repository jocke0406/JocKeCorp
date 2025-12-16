import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { getSeoFor } from '../../core/seo.loader';

type DeculpSubject = {
  id: string; // slug route
  title: string; // intitulé clair
  slug: string;
  excerpt: string; // 1 ligne (placeholder pour Mots)
  tags?: string[]; // optionnel
};

@Component({
  selector: 'jc-deculpabilisation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deculpabilisation.component.html',
  styleUrl: './deculpabilisation.component.scss',
})
export class DeculpabilisationComponent implements OnInit {
  private seo = inject(SeoService);
  trackById = (_: number, item: { id: string }) => item.id;

  readonly subjects: DeculpSubject[] = [
    {
      id: 'OU-23',
      slug: 'deculp-ouch-23',
      title: 'Continuer pendant que le monde s’effondre',
      excerpt:
        'Le monde brûle. Vous, vous avez encore du chauffage. ' +
        'La persistance d’un confort individuel en contexte global dégradé a été signalée. ' +
        'Dossier recevable.',
      tags: ['quotidien', 'lucidité'],
    },
    {
      id: 'OU-24',
      slug: 'deculp-ouch-24',
      title: 'Profiter de ce que l’on condamne',
      excerpt:
        'Vous bénéficiez de ce que vous critiquez. ' +
        'Usage confirmé d’un système idéologiquement contesté. ' +
        'Incohérence notée, poursuite autorisée.',
      tags: ['système', 'contradiction'],
    },
    {
      id: 'OU-25',
      slug: 'deculp-ouch-25',
      title: 'S’indigner de manière sélective',
      excerpt:
        'Votre empathie a une géographie variable. ' +
        'Capacité d’indignation partielle constatée. ' +
        'Fonctionnement conforme aux limites humaines standard.',
      tags: ['empathie', 'limites'],
    },
    {
      id: 'OU-26',
      slug: 'deculp-ouch-26',
      title: 'Parler, commenter, partager à la place d’agir',
      excerpt:
        'Vous commentez, partagez, expliquez. ' +
        'Expression symbolique enregistrée. ' +
        'Action matérielle absente. Dossier néanmoins recevable.',
      tags: ['expression', 'inaction'],
    },
    {
      id: 'OU-27',
      slug: 'deculp-ouch-27',
      title: 'S’habituer à l’inacceptable',
      excerpt:
        'L’inacceptable ne provoque plus d’arrêt réflexe. ' +
        'Processus d’habituation en cours. ' +
        'Mécanisme reconnu. Requête admissible.',
      tags: ['habituation', 'survie'],
    },
  ];

  ngOnInit(): void {
    const cfg = getSeoFor('/deculpabilisation');

    const pageJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': cfg?.schemaType ?? 'WebPage',
      name: cfg?.title ?? 'Déculpabilisation — Service Central | JocKeCorp™',
      url: cfg?.canonical ?? 'https://jocke.be/deculpabilisation',
    };

    // ✅ BreadcrumbList conforme (l'erreur Search Console vient de là)
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

    // ✅ ItemList : reflète tes "charges" (catalogue)
    const listJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Catalogue des charges morales',
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: this.subjects.length,
      itemListElement: this.subjects.map((s, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${s.id} — ${s.title}`,
        url: `https://jocke.be/deculpabilisation/${s.slug}`,
      })),
    };

    // On envoie un tableau JSON-LD (plus propre que tout imbriquer)
    const jsonLd = [pageJsonLd, listJsonLd];

    this.seo.setMeta({
      title: cfg?.title ?? 'Déculpabilisation — Service Central | JocKeCorp™',
      description:
        cfg?.description ??
        'Service Central de Déculpabilisation : inventaire administratif des charges morales. Sélectionnez un dossier et examinez la charge.',
      canonical: cfg?.canonical ?? 'https://jocke.be/deculpabilisation',
      robots: cfg?.robots ?? 'index,follow',
      image: cfg?.ogImage,
      jsonLd,
    });
  }
}
