import {
  AfterViewInit,
  OnInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import type P5 from 'p5';
import { palettes, type Palette } from '../../shared/palettes';
import { AuthService } from '../../core/service/auth.service';
import { MessageService } from 'primeng/api'; // pour le petit toast de sortie (optionnel)
import { ToastModule } from 'primeng/toast';
import { SeoService } from '../../core/seo.service';
import { getSeoFor } from '../../core/seo.loader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ToastModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // ✅ injection moderne Angular 19
  private seo = inject(SeoService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly msg = inject(MessageService);
  isConnected = computed(() => this.auth.isAuthenticated());

  // === p5
  @ViewChild('p5Host', { static: true }) p5Host!: ElementRef<HTMLDivElement>;
  private p5?: P5;

  // === États
  helpVisible = false;
  secretVisible = false;

  private seconds = 0;
  private chronoInt?: number;
  chrono$ = signal('00:00:00');

  liveMessages: Array<{ text: string; style: Record<string, string> }> = [];
  private msgInt?: number;

  // === Messages
  private messages = [
    '« Certifié apte à ne rien entreprendre. » — Nicolas II, 15 mars 1917',
    '« Permis d’admirer — catégorie A. » — Charles Baudelaire, 9 avril 1851',
    '« La reconnaissance extérieure commence par la reconnaissance de la certification intérieure. » — Jean-Claude Van Damme, 18 octobre 1960 — autocertifié',
    '« Mon existence est un concept flou mais administrativement cohérent. » — Banksy, 5 octobre 2018',
    '« Je suis né d’un formulaire égaré. » — Fille n°34 de Jonathan Jacob Meijer, 28 avril 2023',
    '« J’ai rempli un dossier. Le néant m’a répondu. » — Friedrich Nietzsche, 3 janvier 1889',
    '« Ma culpabilité est en reconversion professionnelle. » — Oskar Schindler, 13 mars 1943',
    '« Mon immobilisme est un engagement. » — Ségolène Royal, 24 janvier 2020',
    '« Je n’ai rien empêché, mais je l’ai fait avec intégrité. » — Ponce Pilate, 3 avril 33',
    '« J’ai suivi une formation sur l’interruption des formations d’interruption. » — user_#12, 21 juillet 2025',
    '« Grâce à ce module, je maîtrise enfin l’art de douter sans réfléchir. » — Dieudonné M’bala M’bala, 26 décembre 2003',
    '« J’ai obtenu une attestation de présence à mon absence. » — Le Soleil, 11 août 1999',
  ];

  toggleHelp(v: boolean) {
    this.helpVisible = v;
  }

  ngOnInit(): void {
    const cfg = getSeoFor('/');

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

  ngOnDestroy(): void {
    if (this.chronoInt) clearInterval(this.chronoInt);
    if (this.msgInt) clearInterval(this.msgInt);
    document.removeEventListener('keydown', this.keyHandler);
    document.removeEventListener('click', this.clickHandler);
    if (this.p5) this.p5.remove();
  }
  ngAfterViewInit(): void {
    // 1. Toujours appliquer le SEO (côté serveur ET côté navigateur)
    const cfg = getSeoFor('/');
    this.seo.setMeta({
      title: cfg?.title,
      description: cfg?.description,
      canonical: cfg?.canonical,
      robots: cfg?.robots,
      image: cfg?.ogImage,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': cfg?.schemaType ?? 'WebPage',
        name: cfg?.title,
        url: cfg?.canonical,
      },
    });

    // 2. Si on est côté serveur (SSR / prerender), on s'arrête là
    if (typeof window === 'undefined') {
      return;
    }

    // 3. Tout ce qui suit ne tourne QUE dans le navigateur
    this.chronoInt = window.setInterval(() => {
      this.seconds++;
      const h = String(Math.floor(this.seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((this.seconds % 3600) / 60)).padStart(2, '0');
      const s = String(this.seconds % 60).padStart(2, '0');
      this.chrono$.set(`${h}:${m}:${s}`);
    }, 1000);

    this.showRandomMessage();
    this.msgInt = window.setInterval(() => this.showRandomMessage(), 7000);

    document.addEventListener('keydown', this.keyHandler);
    document.addEventListener('click', this.clickHandler);

    // ✅ appel asynchrone p5 différé pour ne pas bloquer l'affichage initial
    setTimeout(() => this.mountP5(), 100);
  }

  private keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') this.revealSecret();
  };
  private clickHandler = () => this.revealSecret();

  revealSecret() {
    this.secretVisible = true;
    setTimeout(() => (this.secretVisible = false), 5000);
  }

  private showRandomMessage() {
    const text = this.messages[Math.floor(Math.random() * this.messages.length)];
    const top = 30 + Math.random() * 40;
    const left = 20 + Math.random() * 60;

    const item = { text, style: { top: `${top}%`, left: `${left}%`, opacity: '0' } };
    this.liveMessages = [...this.liveMessages, item];
    queueMicrotask(() => {
      item.style.opacity = '1';
    });

    setTimeout(() => {
      item.style.opacity = '0';
      setTimeout(() => {
        this.liveMessages = this.liveMessages.filter((m) => m !== item);
      }, 1000);
    }, 6500);
  }

  logout() {
    this.auth.clear();
    this.msg.add({
      severity: 'info',
      summary: 'Déconnexion',
      detail: 'Le Bureau vous oubliera... jusqu’à votre prochain retour.',
      life: 3500,
    });
    setTimeout(() => this.router.navigateByUrl('/login'), 300);
  }

  private async mountP5() {
    const { default: P5 } = await import('p5');
    const host = this.p5Host.nativeElement;

    const sketch = (p: P5) => {
      let cols = 0,
        rows = 0,
        cellW = 0,
        cellH = 0;
      let cells: { eye: RetroEye }[][] = [];

      class RetroEye {
        palette: Palette;
        phi = 1.618;
        ouverture = 1.2;
        decoElements: any[] = [];
        freqX: number;
        freqY: number;
        phase: number;

        width = 0;
        height = 0;
        ampX = 0;
        ampY = 0;
        eyeH = 0;
        eyeW = 0;
        innerH = 0;
        upperArcH = 0;
        lowerArcH = 0;
        irisDiameter = 0;
        pupilDiameter = 0;

        constructor(palette?: Palette) {
          this.palette = palette ?? palettes[Math.floor(Math.random() * palettes.length)];
          this.freqX = p.random(2, 5);
          this.freqY = p.random(1.5, 4);
          this.phase = p.random(p.TWO_PI);
        }

        setup(w: number, h: number) {
          this.ampX = Math.min(w, h) * p.random(0, 0.1);
          this.ampY = Math.min(w, h) * p.random(0, 0.1);

          this.width = w;
          this.height = h;

          this.eyeH = h * 0.7;
          this.eyeW = this.eyeH * this.phi;

          this.innerH = this.eyeH * this.ouverture;
          this.upperArcH = this.innerH * (1 / (1 + 1 / this.phi));
          this.lowerArcH = this.innerH - this.upperArcH;

          this.irisDiameter = this.innerH * 0.6;
          this.pupilDiameter = this.irisDiameter * 0.4;

          this.decoElements = [];
          const minSize = Math.min(w, h) * 0.08;
          const maxSize = Math.min(w, h) * 0.15;

          // petits rectangles décoratifs
          for (let i = 0; i < 10; i++) {
            this.decoElements.push({
              type: 'rect',
              x: p.random(w),
              y: p.random(h),
              size: p.random(minSize, maxSize),
              col: this.palette.blockColors[
                Math.floor(p.random(this.palette.blockColors.length))
              ],
            });
          }

          const arcSize = Math.min(w, h) * 0.4;
          this.decoElements.push({
            type: 'arc',
            x: w * 0.15,
            y: h * 0.15,
            size: arcSize,
            col: this.palette.arcDeco,
          });

          this.decoElements.push({
            type: 'bar',
            x: w * 0.75,
            y: h * 0.9,
            w: w * 0.15,
            h: h * 0.025,
            col: this.palette.barDeco,
          });
        }

        draw(t: number, glitch = false) {
          p.background(this.palette.background as any);

          // grille de fond
          p.stroke(this.palette.grid as any);
          p.strokeWeight(0.5);
          const spacing = 36;
          for (let x = 0; x < this.width; x += spacing) p.line(x, 0, x, this.height);
          for (let y = 0; y < this.height; y += spacing) p.line(0, y, this.width, y);

          const hexWithAlpha = (hex: string, a: number) => {
            const v = hex.replace('#', '');
            const r = parseInt(v.slice(0, 2), 16);
            const g = parseInt(v.slice(2, 4), 16);
            const b = parseInt(v.slice(4, 6), 16);
            return p.color(r, g, b, Math.round(a * 255));
          };

          // éléments décoratifs
          for (const d of this.decoElements) {
            p.noStroke();
            if (d.type === 'rect') {
              p.fill(hexWithAlpha(d.col, 0.53));
              p.rect(d.x, d.y, d.size, d.size);
            } else if (d.type === 'arc') {
              p.fill(hexWithAlpha(d.col, 0.6));
              p.arc(d.x, d.y, d.size, d.size, p.PI, 0, p.CHORD);
            } else if (d.type === 'bar') {
              p.fill(hexWithAlpha(d.col, 0.67));
              p.rect(d.x, d.y, d.w, d.h);
            }
          }

          p.push();
          p.translate(this.width / 2, this.height / 2);

          // halo
          p.noFill();
          for (let i = 0; i < 60; i++) {
            const alpha = p.map(i, 0, 60, this.palette.halo.alphaStart, 0);
            p.stroke(
              this.palette.halo.color[0],
              this.palette.halo.color[1],
              this.palette.halo.color[2],
              alpha
            );
            p.strokeWeight(30);
            p.ellipse(0, 0, this.eyeW + i * 8, this.eyeH + i * 8);
          }

          // mouvement nystagmus
          let nystagX = p.sin(t * this.freqX + this.phase) * this.ampX;
          let nystagY = p.cos(t * this.freqY + this.phase) * this.ampY;
          if (glitch) {
            nystagX += p.random([-80, 80]);
            nystagY += p.random([-30, 30]);
          }

          // zone centrale
          p.noStroke();
          p.beginShape();
          p.fill(this.palette.cdZone as any);
          for (let a = p.PI; a >= 0; a -= 0.05)
            p.vertex((this.eyeW / 2) * p.cos(a), -(this.upperArcH / 2) * p.sin(a));
          for (let a = 0; a <= p.PI; a += 0.05)
            p.vertex((this.eyeW / 2) * p.cos(a), (this.lowerArcH / 2) * p.sin(a));
          p.endShape(p.CLOSE);

          // iris + pupille
          p.fill(this.palette.iris as any);
          p.ellipse(nystagX, nystagY, this.irisDiameter, this.irisDiameter);

          p.fill(this.palette.pupil as any);
          p.ellipse(nystagX, nystagY, this.pupilDiameter, this.pupilDiameter);

          // paupières
          p.fill(this.palette.upperLid as any);
          p.beginShape();
          for (let a = p.PI; a >= 0; a -= 0.05)
            p.vertex((this.eyeW / 2) * p.cos(a), -(this.eyeH / 2) * p.sin(a));
          for (let a = 0; a <= p.PI; a += 0.05)
            p.vertex((this.eyeW / 2) * p.cos(a), -(this.upperArcH / 2) * p.sin(a));
          p.endShape(p.CLOSE);

          p.fill(this.palette.lowerLid as any);
          p.beginShape();
          for (let a = 0; a <= p.PI; a += 0.05)
            p.vertex((this.eyeW / 2) * p.cos(a), (this.eyeH / 2) * p.sin(a));
          for (let a = p.PI; a >= 0; a -= 0.05)
            p.vertex((this.eyeW / 2) * p.cos(a), (this.lowerArcH / 2) * p.sin(a));
          p.endShape(p.CLOSE);

          p.pop();
        }
      }

      const generateGrid = () => {
        cols = Math.floor(p.random(1, 5));
        rows = Math.floor(p.random(1, 5));
        cellW = p.width / cols;
        cellH = p.height / rows;

        cells = Array.from({ length: cols }, () =>
          Array.from({ length: rows }, () => ({
            eye: new RetroEye(palettes[Math.floor(Math.random() * palettes.length)]),
          }))
        );

        for (let i = 0; i < cols; i++)
          for (let j = 0; j < rows; j++) cells[i][j].eye.setup(cellW, cellH);
      };

      p.setup = () => {
        const c = p.createCanvas(host.clientWidth, host.clientHeight);
        c.parent(host);
        p.frameRate(60);
        generateGrid();
        setInterval(generateGrid, 3000);
      };

      p.windowResized = () => {
        p.resizeCanvas(host.clientWidth, host.clientHeight);
        generateGrid();
      };

      p.draw = () => {
        const t = p.millis() / 1000;
        const glitch = p.frameCount % 240 < 2 && p.random() < 0.5;

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = i * cellW,
              y = j * cellH;
            p.push();
            p.translate(x, y);
            (p as any).drawingContext.save();
            (p as any).drawingContext.beginPath();
            (p as any).drawingContext.rect(0, 0, cellW, cellH);
            (p as any).drawingContext.clip();
            cells[i][j].eye.draw(t, glitch);
            (p as any).drawingContext.restore();
            p.pop();
          }
        }
      };

      p.keyPressed = () => {
        if (p.key === ' ') generateGrid();
      };
    };

    this.p5 = new P5(sketch);
  }
}
