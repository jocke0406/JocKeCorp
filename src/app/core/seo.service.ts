import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface Breadcrumb {
  name: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private titleSrv = inject(Title);

  /**
   * Met à jour dynamiquement les balises SEO, OG, Twitter et JSON-LD
   */
  setMeta(opts: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    robots?: string;
    canonical?: string;
    jsonLd?: Record<string, any>; // WebPage, LoginPage, etc.
    breadcrumbs?: Breadcrumb[]; // <<< NEW
  }) {
    const {
      title,
      description,
      url = 'https://jocke.be/',
      image = 'https://jocke.be/og/home.jpg',
      robots = 'index,follow',
      canonical,
      jsonLd,
      breadcrumbs,
    } = opts;

    // TITLE + DESCRIPTION
    if (title) this.titleSrv.setTitle(title);
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }
    this.meta.updateTag({ name: 'robots', content: robots });

    // CANONICAL
    if (canonical) {
      let linkEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'canonical');
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute('href', canonical);
    }

    // OPEN GRAPH
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title ?? '' });
    this.meta.updateTag({
      property: 'og:description',
      content: description ?? '',
    });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });

    // TWITTER
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: title ?? '' });
    this.meta.updateTag({
      name: 'twitter:description',
      content: description ?? '',
    });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // JSON-LD (données structurées : WebPage + BreadcrumbList)
    const old = document.getElementById('jsonld');
    if (old) old.remove();

    const graph: any[] = [];

    // 1) WebPage / LoginPage / etc. (optionnel)
    if (jsonLd) {
      graph.push(jsonLd);
    }

    // 2) BreadcrumbList si on a des breadcrumbs
    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: b.name,
          item: b.url,
        })),
      });
    }

    if (graph.length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'jsonld';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph,
      });
      document.head.appendChild(script);
    }
  }
}
