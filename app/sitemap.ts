import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.bouderba-rental.com';
const LOCALES = ['fr', 'en', 'es', 'ar'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ---- Core pages for each locale ----
  const coreRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/reservation', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/agency', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/locations', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/legal', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/vehicles', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/guide-marrakech', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/itineraires', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  const localizedEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of coreRoutes) {
      const url = `${BASE_URL}/${locale}${route.path}`;
      localizedEntries.push({
        url,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${route.path}`])
          ),
        },
      });
    }
  }

  // ---- Canonical homepage (no locale prefix) ----
  localizedEntries.unshift({
    url: BASE_URL,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  return localizedEntries;
}
