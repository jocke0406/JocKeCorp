import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/service/auth.service';
import { RandomNameService } from './core/service/random-name.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToastModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly auth = inject(AuthService);
  private readonly aliasSvc = inject(RandomNameService);

  // ✅ connecté = header + alias visibles
  isConnected = computed(() => this.auth.isAuthenticated());

  // ✅ alias dynamique (sinon fallback localStorage)
  currentAlias = computed(() =>
    this.aliasSvc.lastAlias() ?? (localStorage.getItem('jocke:alias') || null)
  );

  // === Mobile menu state
  readonly isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  // Optionnel : verrouille le scroll de la page quand le menu est ouvert en mobile
  // (tu peux retirer si tu préfères)
  private bodyLockEffect = effect(() => {
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Fermer auto si on repasse en > 560px
  constructor() {
    const mq = window.matchMedia('(min-width: 561px)');
    const handler = () => this.closeMenu();
    mq.addEventListener('change', handler);
  }
}
