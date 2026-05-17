import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Le "matcher" indique à Next.js quelles routes doivent passer par ce middleware.
  // Il va intercepter la racine (/) et toutes les routes contenant tes langues.
  matcher: ['/', '/(fr|en|es|ar)/:path*']
};
