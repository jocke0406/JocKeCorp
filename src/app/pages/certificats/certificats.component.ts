import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/service/api.service'; // ajuste le chemin

@Component({
  standalone: true,
  selector: 'jc-certificats',
  imports: [CommonModule],
  template: `
    <h2>Attestations & Certificats</h2>
    <p>Status API : <strong>{{ status }}</strong></p>
  `,
})
export class CertificatsComponent implements OnInit {
  private api = inject(ApiService);
  status = '…';

  ngOnInit() {
    this.api.get<{ ok: boolean }>('/health').subscribe({
      next: () => (this.status = 'OK ✅'),
      error: () => (this.status = 'KO ❌'),
    });
  }
}
