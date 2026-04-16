'use client';

import { usePathname } from 'next/navigation';
import { routing } from '../../i18n/routing';

export default function HreflangTags() {
    const pathname = usePathname() || '/';
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://bouderba-rental.com';

    // pathname from next/navigation INCLUDES the locale, e.g. "/fr/agency".
    const segments = pathname.split('/');
    let cleanPathname = pathname;
    
    // Si le premier segment est une locale valide, on le retire pour avoir la base
    if (segments.length > 1 && routing.locales.includes(segments[1] as any)) {
        segments.splice(1, 1);
        cleanPathname = segments.join('/');
    }

    // Retrait du slash final s'il reste juste ça pour éviter "/fr/" au lieu de "/fr"
    if (cleanPathname === '/') cleanPathname = '';

    return (
        <>
            {routing.locales.map((loc) => {
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
            <link 
                rel="alternate" 
                hrefLang="x-default" 
                href={`${origin}/${routing.defaultLocale}${cleanPathname}`} 
            />
        </>
    );
}
