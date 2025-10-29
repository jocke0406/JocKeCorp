import seo from '../../seo/seo.config.json';
export const getSeoFor = (route: string) => (seo as any)[route] ?? null;


