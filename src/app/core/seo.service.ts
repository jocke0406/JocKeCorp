import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
    private meta = inject(Meta);
    private titleSrv = inject(Title);

    /**
     * Met à jour dynamiquement les balises SEO, OG et Twitter
     * + alt image + keywords internes (optionnels)
     */
    setMeta(opts: {
        title?: string;
        description?: string;
        url?: string;
        image?: string;
        robots?: string;
        canonical?: string;
        jsonLd?: object;
        ogImageAlt?: string;
        primaryKeyword?: string;
        secondaryKeywords?: string[];
    }) {
        const {
            title,
            description,
            url = 'https://jocke.be/',
            image = 'https://jocke.be/og/home.jpg',
            robots = 'index,follow',
            canonical,
            jsonLd,
            ogImageAlt,
            primaryKeyword,
            secondaryKeywords
        } = opts;

        // TITLE + DESCRIPTION
        if (title) this.titleSrv.setTitle(title);
        if (description)
            this.meta.updateTag({ name: 'description', content: description });
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
        this.meta.updateTag({ property: 'og:description', content: description ?? '' });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:image', content: image });
        if (ogImageAlt) {
            this.meta.updateTag({ property: 'og:image:alt', content: ogImageAlt });
        }

        // TWITTER
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: title ?? '' });
        this.meta.updateTag({ name: 'twitter:description', content: description ?? '' });
        this.meta.updateTag({ name: 'twitter:image', content: image });

        // KEYWORDS (option interne, non SEO)
        const keywordsList: string[] = [];
        if (primaryKeyword) keywordsList.push(primaryKeyword);
        if (secondaryKeywords?.length) keywordsList.push(...secondaryKeywords);
        if (keywordsList.length) {
            this.meta.updateTag({
                name: 'keywords',
                content: keywordsList.join(', ')
            });
        }

        // JSON-LD (données structurées)
        const old = document.getElementById('jsonld');
        if (old) old.remove();
        if (jsonLd) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'jsonld';
            script.text = JSON.stringify(jsonLd);
            document.head.appendChild(script);
        }
    }
}
