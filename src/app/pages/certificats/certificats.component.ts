import { Component, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { getSeoFor } from '../../core/seo.loader';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'jkc-certificats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './certificats.component.html',
  styleUrls: ['./certificats.component.scss'], // ✅ important : pluriel
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatsComponent implements OnInit {
  private seo = inject(SeoService);
  private auth = inject(AuthService);

  /** Nom affiché dans la page catalogue (optionnel si pas connecté) */
  readonly displayName = computed(() => {
    const user = this.auth.user();
    const fromUser = (user?.display_name || '').trim();
    const fromStorage = (localStorage.getItem('jocke:last-display') || '').trim();
    return fromUser || fromStorage || 'Initié de l’Inutile';
  });

  ngOnInit(): void {
    const cfg = getSeoFor('/certificats');

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
          }),
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
