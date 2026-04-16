'use client';

import { usePathname } from '../../i18n/routing';
import { routing } from '../../i18n/routing';
import { useEffect, useState } from 'react';

export default function HreflangTags() {
    const pathname = usePathname();
    // Nom de domaine par défaut configuré pour garantir le Server-Side Rendering (SEO optimal)
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://bouderba-rental.com';

    // Format du pathname (gérer le slash de fin)
    const cleanPathname = pathname === '/' ? '' : pathname;

    return (
        <>
            {routing.locales.map((loc) => {
                // Correspondance exacte des codes langues SEO (ex: MA -> ar-MA)
                const seoLang = loc === 'ma' ? 'ar-MA' : loc;
                
                return (
                    <link 
                        key={loc} 
                        rel="alternate" 
                        hrefLang={seoLang} 
                        href={`${origin}/${loc}${cleanPathname}`} 
                    />
                );
            })}
            {/* Langue par défaut pour "x-default" */}
            <link 
                rel="alternate" 
                hrefLang="x-default" 
                href={`${origin}/${routing.defaultLocale}${cleanPathname}`} 
            />
        </>
    );
}
