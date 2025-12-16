import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { getSeoFor } from '../../core/seo.loader';

@Component({
  selector: 'jc-dossier-existentiel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dossier-existentiel.component.html',
  styleUrl: './dossier-existentiel.component.scss',
})
export class DossierExistentielComponent implements OnInit {
  private seo = inject(SeoService);

  subjects = [
    {
      id: 'OU-23',
      slug: 'deculp-ouch-23',
      title: 'Vous avez fait semblant d’aller bien',
      excerpt:
        'Vous avez répondu “ça va” alors que ce n’était manifestement pas le cas.',
      tags: ['Mensonge social', 'Auto-contrôle', 'Politesse'],
    },
    // autres charges plus tard…
  ];

  trackById = (_: number, item: { id: string }) => item.id;


  ngOnInit(): void {
    const cfg = getSeoFor('/dossier');

    const jsonLd: any = {
      '@context': 'https://schema.org',
      '@type': cfg?.schemaType ?? 'WebPage',
      name: cfg?.title,
      url: cfg?.canonical,
    };

    // ✅ Ajout du BreadcrumbList conforme à Google
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
}
