// src/app/app.routes.server.ts
import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'certificats',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'deculpabilisation',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dossier',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'formations',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'anomalies',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
