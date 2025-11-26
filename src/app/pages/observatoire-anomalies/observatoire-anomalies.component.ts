import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { getSeoFor } from '../../core/seo.loader';

@Component({
  selector: 'jc-observatoire-anomalies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './observatoire-anomalies.component.html',
  styleUrl: './observatoire-anomalies.component.scss',
})
export class ObservatoireAnomaliesComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    const cfg = getSeoFor('/anomalies');

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
