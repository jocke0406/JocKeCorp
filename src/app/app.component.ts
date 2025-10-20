import { Component, computed, inject } from '@angular/core';
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
}
